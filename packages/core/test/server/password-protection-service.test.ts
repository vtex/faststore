import { decodeJwt, errors, importSPKI, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

import {
  PasswordProtectionService,
  resetPasswordProtectionPublicKeyCacheForTests,
} from '../../src/server/password-protection-service'

function setNodeEnv(value: string | undefined): void {
  const env = process.env as Record<string, string | undefined>
  env.NODE_ENV = value
}

jest.mock('../../discovery.config', () => ({
  __esModule: true,
  default: {
    api: { storeId: 'test-store' },
  },
}))

jest.mock('jose', () => {
  class MockJWTExpired extends Error {
    payload: Record<string, unknown>
    claim: string

    constructor(
      message: string,
      payload: Record<string, unknown>,
      claim = 'exp'
    ) {
      super(message)
      this.name = 'JWTExpired'
      this.payload = payload
      this.claim = claim
    }
  }

  return {
    jwtVerify: jest.fn(),
    importSPKI: jest.fn(),
    decodeJwt: jest.fn(),
    errors: {
      JWTExpired: MockJWTExpired,
    },
  }
})

const jwtVerifyMock = jwtVerify as jest.MockedFunction<typeof jwtVerify>
const importSPKIMock = importSPKI as jest.MockedFunction<typeof importSPKI>
const decodeJwtMock = decodeJwt as jest.MockedFunction<typeof decodeJwt>

function previewRequest(
  path: string,
  init?: ConstructorParameters<typeof NextRequest>[1]
): NextRequest {
  return new NextRequest(`https://preview.vtex.app${path}`, {
    ...init,
    headers: {
      host: 'preview.vtex.app',
      ...init?.headers,
    },
  })
}

describe('PasswordProtectionService', () => {
  const originalNodeEnv = process.env.NODE_ENV
  const originalCustomDomains = process.env.CUSTOM_DOMAINS_PROTECTION_ENABLED

  beforeEach(() => {
    setNodeEnv('production')
    delete process.env.CUSTOM_DOMAINS_PROTECTION_ENABLED
    resetPasswordProtectionPublicKeyCacheForTests()
    jest.clearAllMocks()
    importSPKIMock.mockResolvedValue({} as CryptoKey)
    global.fetch = jest.fn()
  })

  afterAll(() => {
    setNodeEnv(originalNodeEnv)
    process.env.CUSTOM_DOMAINS_PROTECTION_ENABLED = originalCustomDomains
  })

  it('skips protection in development', async () => {
    setNodeEnv('development')

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/p')
    )

    expect(response.status).toBe(200)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('allows traffic when WebOps reports not protected and sets negative-cache cookie', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        protected: false,
        token: 'neg-cache-token',
      }),
    })

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/products')
    )

    expect(response.status).toBe(200)
    expect(response.cookies.get('__fs_password_protection')?.value).toBe(
      'neg-cache-token'
    )
    expect(global.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringMatching(
          /\/api\/v1\/password-protection\/status.*storeId=test-store/
        ),
      }),
      expect.any(Object)
    )
  })

  it('redirects to unlock page when protected and host matches DEFAULT_DOMAINS scope', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        protected: true,
        passwordVersion: 'v1',
        scope: 'DEFAULT_DOMAINS',
      }),
    })

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/secret')
    )

    expect(response.status).toBe(307)
    const location = response.headers.get('location') ?? ''
    expect(location).toContain('/password-protection')
    expect(location).toContain('returnTo=%2Fsecret')
  })

  it('allows traffic when protected but scope does not apply to this host', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        protected: true,
        scope: 'CUSTOM_DOMAINS',
      }),
    })

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/p')
    )

    expect(response.status).toBe(200)
  })

  it('redirects to unlock page when protected for ALL_DOMAINS on custom host', async () => {
    process.env.CUSTOM_DOMAINS_PROTECTION_ENABLED = 'true'
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        protected: true,
        scope: 'ALL_DOMAINS',
      }),
    })

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      new NextRequest('https://shop.example.com/checkout', {
        headers: { host: 'shop.example.com' },
      })
    )

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('returnTo=%2Fcheckout')
  })

  it('allows traffic when JWT is valid and store is password-protected', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ publicKey: 'test-pem' }),
    })

    jwtVerifyMock.mockResolvedValueOnce({
      payload: {
        storeId: 'test-store',
        protected: true,
        scope: 'DEFAULT_DOMAINS',
      },
      protectedHeader: { alg: 'RS256' },
    } as unknown as Awaited<ReturnType<typeof jwtVerify>>)

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/account', {
        headers: { cookie: '__fs_password_protection=valid' },
      })
    )

    expect(response.status).toBe(200)
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        pathname: '/api/v1/password-protection/public-key',
      })
    )
  })

  it('verifies JWT locally when cookie present (not protected payload)', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ publicKey: 'test-pem' }),
    })

    jwtVerifyMock.mockResolvedValueOnce({
      payload: {
        storeId: 'test-store',
        protected: false,
      },
      protectedHeader: { alg: 'RS256' },
    } as unknown as Awaited<ReturnType<typeof jwtVerify>>)

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/p', {
        headers: {
          host: 'preview.vtex.app',
          cookie: '__fs_password_protection=abc',
        },
      })
    )

    expect(response.status).toBe(200)
    expect(jwtVerifyMock).toHaveBeenCalled()
  })

  it('treats wrong storeId in JWT as unauthenticated and calls status', async () => {
    jwtVerifyMock.mockResolvedValueOnce({
      payload: {
        storeId: 'other-store',
        protected: false,
      },
      protectedHeader: { alg: 'RS256' },
    } as unknown as Awaited<ReturnType<typeof jwtVerify>>)
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ publicKey: 'test-pem' }),
    })
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        protected: true,
        scope: 'DEFAULT_DOMAINS',
      }),
    })

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/x', {
        headers: {
          cookie: '__fs_password_protection=bad',
        },
      })
    )

    expect(response.status).toBe(307)
  })

  it('falls back to status when cookie JWT fails verification for non-expiry reasons', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ publicKey: 'test-pem' }),
    })
    jwtVerifyMock.mockRejectedValueOnce(new Error('invalid signature'))
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        protected: false,
        token: 'after-bad-jwt',
      }),
    })

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/p', {
        headers: { cookie: '__fs_password_protection=garbage' },
      })
    )

    expect(response.status).toBe(200)
    expect(response.cookies.get('__fs_password_protection')?.value).toBe(
      'after-bad-jwt'
    )
    expect(jwtVerifyMock).toHaveBeenCalled()
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('renews session when JWT is expired and WebOps renew succeeds', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ publicKey: 'test-pem' }),
    })

    jwtVerifyMock.mockRejectedValueOnce(
      new errors.JWTExpired('jwt expired', { storeId: 'test-store' })
    )

    decodeJwtMock.mockReturnValueOnce({
      storeId: 'test-store',
      protected: true,
      scope: 'DEFAULT_DOMAINS',
    } as ReturnType<typeof decodeJwt>)
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        valid: true,
        token: 'renewed-token',
      }),
    })

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/p', {
        headers: { cookie: '__fs_password_protection=old' },
      })
    )

    expect(response.status).toBe(200)
    expect(response.cookies.get('__fs_password_protection')?.value).toBe(
      'renewed-token'
    )
  })

  it('redirects to unlock page when JWT is expired and renew response is not ok', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ publicKey: 'test-pem' }),
    })
    jwtVerifyMock.mockRejectedValueOnce(
      new errors.JWTExpired('jwt expired', { storeId: 'test-store' })
    )
    decodeJwtMock.mockReturnValueOnce({
      storeId: 'test-store',
      protected: true,
      scope: 'DEFAULT_DOMAINS',
    } as ReturnType<typeof decodeJwt>)
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 502,
    })

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/p', {
        headers: { cookie: '__fs_password_protection=expired' },
      })
    )

    expect(response.status).toBe(307)
  })

  it('redirects to unlock page when JWT is expired and renew body is not valid', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ publicKey: 'test-pem' }),
    })
    jwtVerifyMock.mockRejectedValueOnce(
      new errors.JWTExpired('jwt expired', { storeId: 'test-store' })
    )
    decodeJwtMock.mockReturnValueOnce({
      storeId: 'test-store',
      protected: true,
      scope: 'DEFAULT_DOMAINS',
    } as ReturnType<typeof decodeJwt>)
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ valid: false }),
    })

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/p', {
        headers: { cookie: '__fs_password_protection=expired' },
      })
    )

    expect(response.status).toBe(307)
  })

  it('allows traffic when renew fails but expired JWT scope does not apply to this host', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ publicKey: 'test-pem' }),
    })
    jwtVerifyMock.mockRejectedValueOnce(
      new errors.JWTExpired('jwt expired', { storeId: 'test-store' })
    )
    decodeJwtMock.mockReturnValueOnce({
      storeId: 'test-store',
      protected: true,
      scope: 'CUSTOM_DOMAINS',
    } as ReturnType<typeof decodeJwt>)
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('renew down'))

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/p', {
        headers: { cookie: '__fs_password_protection=old' },
      })
    )

    expect(response.status).toBe(200)
  })

  it('fail-closes to unlock page on default domain when status request fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('network'))

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/p')
    )

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/password-protection')
  })

  it('fail-closes to unlock page when status endpoint returns a non-ok HTTP status', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 503,
    })

    const service = new PasswordProtectionService()
    const { response } = await service.checkStoreProtection(
      previewRequest('/p')
    )

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/password-protection')
  })

  it('fail-closes to unlock page on custom domain when status request fails', async () => {
    process.env.CUSTOM_DOMAINS_PROTECTION_ENABLED = 'true'
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('network'))

    const service = new PasswordProtectionService()
    const request = new NextRequest('https://shop.example.com/page', {
      headers: { host: 'shop.example.com' },
    })

    const { response } = await service.checkStoreProtection(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/password-protection')
  })

  it('does not enforce protection on custom domain when env gate is off', async () => {
    const service = new PasswordProtectionService()
    const request = new NextRequest('https://shop.example.com/page', {
      headers: { host: 'shop.example.com' },
    })

    const { response } = await service.checkStoreProtection(request)

    expect(response.status).toBe(200)
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
