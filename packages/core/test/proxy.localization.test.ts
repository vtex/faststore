import { NextRequest, NextResponse } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const checkStoreProtectionMock = vi.hoisted(() => vi.fn())
const getSubdomainBindingsMock = vi.hoisted(() => vi.fn())
const getCustomPathsFromBindingsMock = vi.hoisted(() => vi.fn())
const isValidLocaleMock = vi.hoisted(() => vi.fn())

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: {
    localization: {
      enabled: true,
      locales: {
        'en-US': { bindings: [] },
        'pt-BR': { bindings: [] },
      },
    },
  },
}))

vi.mock('../src/server/password-protection-service', () => ({
  PasswordProtectionService: class {
    checkStoreProtection = checkStoreProtectionMock
  },
}))

vi.mock('src/utils/localization/bindingPaths', () => ({
  getCustomPathsFromBindings: getCustomPathsFromBindingsMock,
  getSubdomainBindings: getSubdomainBindingsMock,
  isValidLocale: isValidLocaleMock,
}))

function localizedRequest(
  pathname: string,
  options?: { locale?: string; host?: string }
): NextRequest {
  const host = options?.host ?? 'localhost:3000'
  const req = new NextRequest(`http://${host}${pathname}`, {
    headers: { host },
  })

  if (options?.locale) {
    Object.defineProperty(req.nextUrl, 'locale', {
      value: options.locale,
      writable: true,
      configurable: true,
    })
  }

  return req
}

describe('proxy localization rewrite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    checkStoreProtectionMock.mockResolvedValue({
      response: NextResponse.next(),
    })
    getSubdomainBindingsMock.mockReturnValue([
      { hostname: 'localhost', locale: 'en-US' },
    ])
    getCustomPathsFromBindingsMock.mockReturnValue([])
    isValidLocaleMock.mockImplementation((locale: string) =>
      ['en-US', 'pt-BR'].includes(locale)
    )
  })

  it('skips subdomain rewrite when request locale differs from root binding locale', async () => {
    const { proxy } = await import('../src/proxy')
    const response = (await proxy(
      localizedRequest('/pvt/account/profile', { locale: 'pt-BR' })
    )) as NextResponse

    expect(response.headers.get('x-middleware-rewrite')).toBeNull()
  })

  it('rewrites when request locale matches subdomain binding locale', async () => {
    const { proxy } = await import('../src/proxy')
    const response = (await proxy(
      localizedRequest('/pvt/account/profile', { locale: 'en-US' })
    )) as NextResponse

    const rewrite = response.headers.get('x-middleware-rewrite')
    expect(rewrite).toContain('/en-US/pvt/account/profile')
  })

  it('rewrites paths without a locale segment when no active locale is set', async () => {
    const { proxy } = await import('../src/proxy')
    const response = (await proxy(
      localizedRequest('/pvt/account/profile')
    )) as NextResponse

    const rewrite = response.headers.get('x-middleware-rewrite')
    expect(rewrite).toContain('/en-US/pvt/account/profile')
  })

  it('skips _next/data rewrite when data locale differs from subdomain locale', async () => {
    const { proxy } = await import('../src/proxy')
    const response = (await proxy(
      localizedRequest(
        '/_next/data/development/pt-BR/pvt/account/profile.json',
        { locale: 'pt-BR' }
      )
    )) as NextResponse

    expect(response.headers.get('x-middleware-rewrite')).toBeNull()
  })

  it('does not rewrite _next/data when data locale matches subdomain locale', async () => {
    const { proxy } = await import('../src/proxy')
    const response = (await proxy(
      localizedRequest(
        '/_next/data/development/en-US/pvt/account/profile.json',
        { locale: 'en-US' }
      )
    )) as NextResponse

    expect(response.headers.get('x-middleware-rewrite')).toBeNull()
  })
})
