import { NextRequest, NextResponse } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const checkStoreProtectionMock = vi.hoisted(() => vi.fn())

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: {
    localization: {
      enabled: false,
      locales: {},
    },
  },
}))

vi.mock('../src/server/password-protection-service', () => ({
  PasswordProtectionService: class {
    checkStoreProtection = checkStoreProtectionMock
  },
}))

vi.mock('src/utils/localization/bindingPaths', () => ({
  getCustomPathsFromBindings: vi.fn(() => []),
  getSubdomainBindings: vi.fn(() => []),
  isValidLocale: vi.fn(() => false),
}))

function request(path = '/products'): NextRequest {
  return new NextRequest(`https://store.example.com${path}`, {
    headers: { host: 'store.example.com' },
  })
}

describe('proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns an error response when access check throws', async () => {
    checkStoreProtectionMock.mockRejectedValue(new Error('access check failed'))
    const { proxy } = await import('../src/proxy')

    const response = await proxy(request('/products'))

    expect(response.type).toBe('error')
  })

  it('returns the protection response when access is blocked', async () => {
    const redirect = NextResponse.redirect(
      new URL(
        '/password-protection?returnTo=%2Fproducts',
        'https://store.example.com'
      )
    )
    checkStoreProtectionMock.mockResolvedValue({ response: redirect })
    const { proxy } = await import('../src/proxy')

    const response = await proxy(request('/products'))

    expect(response).toBe(redirect)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/password-protection')
  })

  it('continues the request and copies protection cookies when access is allowed', async () => {
    const protectionResponse = NextResponse.next()
    protectionResponse.cookies.set('__fs_password_protection', 'jwt-abc')
    checkStoreProtectionMock.mockResolvedValue({ response: protectionResponse })
    const { proxy } = await import('../src/proxy')

    const response = (await proxy(request('/products?sku=1'))) as NextResponse

    expect(response.status).toBe(200)
    expect(response.cookies.get('__fs_password_protection')?.value).toBe(
      'jwt-abc'
    )
  })

  it('keeps the root and data routes in the matcher configuration', async () => {
    const { config } = await import('../src/proxy')
    const dynamicRouteMatcher = config.matcher[1]
    const matcherRegex = new RegExp(`^${dynamicRouteMatcher}$`)

    expect(config.matcher).toContain('/')
    expect(config.matcher).toContain('/_next/data/:path*')
    expect(config.matcher).toEqual(
      expect.arrayContaining([
        expect.stringContaining('api/fs/password-protection/unlock$'),
        expect.stringContaining('password-protection'),
        expect.stringContaining('~partytown'),
      ])
    )
    expect(config.matcher).not.toEqual(
      expect.arrayContaining([expect.stringContaining('(?!api|')])
    )
    expect(matcherRegex.test('/api/fs/password-protection/unlock')).toBe(false)
    expect(matcherRegex.test('/api/products')).toBe(true)
  })
})
