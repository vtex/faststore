import { decodeJwt, errors, importSPKI, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

import {
  AuthenticationService,
  resetPasswordProtectionPublicKeyCacheForTests,
} from '../../src/server/authentication-service'

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

describe('AuthenticationService', () => {
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

    const service = new AuthenticationService()
    const { response } = await service.authenticateRequest(previewRequest('/p'))

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

    const service = new AuthenticationService()
    const { response } = await service.authenticateRequest(
      previewRequest('/products')
    )

    expect(response.status).toBe(200)
    expect(response.cookies.get('__fs_auth_token')?.value).toBe(
      'neg-cache-token'
    )
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/password-protection/status'),
      expect.any(Object)
    )
  })

  it('redirects to login when protected and host matches DEFAULT_DOMAINS scope', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        protected: true,
        passwordVersion: 'v1',
        scope: 'DEFAULT_DOMAINS',
      }),
    })

    const service = new AuthenticationService()
    const { response } = await service.authenticateRequest(
      previewRequest('/secret')
    )

    expect(response.status).toBe(307)
    const location = response.headers.get('location') ?? ''
    expect(location).toContain('/fs-auth-login')
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

    const service = new AuthenticationService()
    const { response } = await service.authenticateRequest(previewRequest('/p'))

    expect(response.status).toBe(200)
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

    const service = new AuthenticationService()
    const { response } = await service.authenticateRequest(
      previewRequest('/p', {
        headers: {
          host: 'preview.vtex.app',
          cookie: '__fs_auth_token=abc',
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

    const service = new AuthenticationService()
    const { response } = await service.authenticateRequest(
      previewRequest('/x', {
        headers: {
          cookie: '__fs_auth_token=bad',
        },
      })
    )

    expect(response.status).toBe(307)
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

    const service = new AuthenticationService()
    const { response } = await service.authenticateRequest(
      previewRequest('/p', {
        headers: { cookie: '__fs_auth_token=old' },
      })
    )

    expect(response.status).toBe(200)
    expect(response.cookies.get('__fs_auth_token')?.value).toBe('renewed-token')
  })

  it('fail-closes to login on default domain when status request fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('network'))

    const service = new AuthenticationService()
    const { response } = await service.authenticateRequest(previewRequest('/p'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/fs-auth-login')
  })

  it('fail-opens on custom domain when status request fails', async () => {
    process.env.CUSTOM_DOMAINS_PROTECTION_ENABLED = 'true'
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('network'))

    const service = new AuthenticationService()
    const request = new NextRequest('https://shop.example.com/page', {
      headers: { host: 'shop.example.com' },
    })

    const { response } = await service.authenticateRequest(request)

    expect(response.status).toBe(200)
  })

  it('does not enforce protection on custom domain when env gate is off', async () => {
    const service = new AuthenticationService()
    const request = new NextRequest('https://shop.example.com/page', {
      headers: { host: 'shop.example.com' },
    })

    const { response } = await service.authenticateRequest(request)

    expect(response.status).toBe(200)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('sets auth cookie without Secure on localhost in production', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        protected: false,
        token: 't',
      }),
    })

    const service = new AuthenticationService()
    const request = new NextRequest('http://localhost:3000/', {
      headers: { host: 'localhost:3000' },
    })

    process.env.CUSTOM_DOMAINS_PROTECTION_ENABLED = 'true'

    const { response } = await service.authenticateRequest(request)

    const cookie = response.cookies.get('__fs_auth_token')
    expect(cookie?.name).toBe('__fs_auth_token')
    expect(cookie?.secure).toBe(false)
  })
})
