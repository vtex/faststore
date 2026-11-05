import { NextRequest, NextResponse } from 'next/server'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest'

/**
 * Proxy-level tests with the real CSP module. Only data-plane (global fetch),
 * password protection and the localization bindings are mocked.
 */

const checkStoreProtectionMock = vi.hoisted(() => vi.fn())
const getSubdomainBindingsMock = vi.hoisted(() => vi.fn())
const storeConfig = vi.hoisted(() => ({
  api: { storeId: 'test-store' },
  localization: {
    enabled: false,
    locales: {} as Record<string, { bindings: unknown[] }>,
  },
}))

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: storeConfig,
}))

vi.mock('../../../src/server/password-protection-service', () => ({
  PasswordProtectionService: class {
    checkStoreProtection = checkStoreProtectionMock
  },
}))

vi.mock('src/utils/localization/bindingPaths', () => ({
  getCustomPathsFromBindings: vi.fn(() => []),
  getSubdomainBindings: getSubdomainBindingsMock,
  isValidLocale: vi.fn((locale: string) => locale === 'en-US'),
}))

const DATA_PLANE = 'https://data-plane.example.com'
const CSP = 'Content-Security-Policy'
const CSP_RO = 'Content-Security-Policy-Report-Only'

function record(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 1,
    storeId: 'test-store',
    mode: 'report-only',
    frameAncestors: {
      mode: 'enforce',
      sources: ["'self'", 'https://{account}.myvtex.com'],
    },
    updatedAt: '2026-10-26T00:00:00.000Z',
    version: 1,
    ...overrides,
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function request(path = '/products', host = 'store.example.com'): NextRequest {
  return new NextRequest(`https://${host}${path}`, { headers: { host } })
}

async function loadProxy() {
  vi.resetModules()
  const { proxy } = await import('../../../src/proxy')
  return proxy
}

describe('proxy with CSP', () => {
  const originalDataPlaneUrl = process.env.DATA_PLANE_API_URL
  let fetchMock: Mock<typeof fetch>

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.DATA_PLANE_API_URL = DATA_PLANE
    storeConfig.localization.enabled = false
    storeConfig.localization.locales = {}
    getSubdomainBindingsMock.mockReturnValue([])
    checkStoreProtectionMock.mockResolvedValue({
      response: NextResponse.next(),
    })
    fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()

    if (originalDataPlaneUrl == null) {
      delete process.env.DATA_PLANE_API_URL
    } else {
      process.env.DATA_PLANE_API_URL = originalDataPlaneUrl
    }
  })

  it('adds the CSP headers to the pass-through response and keeps protection cookies', async () => {
    const protectionResponse = NextResponse.next()
    protectionResponse.cookies.set('__fs_password_protection', 'jwt-abc')
    checkStoreProtectionMock.mockResolvedValue({ response: protectionResponse })
    fetchMock.mockResolvedValue(jsonResponse(record()))
    const proxy = await loadProxy()

    const response = (await proxy(request())) as NextResponse

    expect(response.status).toBe(200)
    expect(response.cookies.get('__fs_password_protection')?.value).toBe(
      'jwt-abc'
    )
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      `${DATA_PLANE}/api/v1/csp/settings?storeId=test-store`
    )
    expect(response.headers.get(CSP)).toBe(
      "frame-ancestors 'self' https://test-store.myvtex.com; report-uri https://endpointcsp.vtex.com/api/report?account=test-store; report-to csp-endpoint"
    )
    expect(response.headers.get(CSP_RO)).toMatch(/^default-src 'self'; /)
    expect(response.headers.get('Reporting-Endpoints')).toBe(
      'csp-endpoint="https://endpointcsp.vtex.com/api/report?account=test-store"'
    )
  })

  it('adds the CSP headers to the localization rewrite response', async () => {
    storeConfig.localization.enabled = true
    storeConfig.localization.locales = { 'en-US': { bindings: [] } }
    getSubdomainBindingsMock.mockReturnValue([
      { hostname: 'store.example.com', locale: 'en-US' },
    ])
    fetchMock.mockResolvedValue(jsonResponse(record({ mode: 'enforce' })))
    const proxy = await loadProxy()

    const response = (await proxy(request('/pvt/account'))) as NextResponse

    expect(response.headers.get('x-middleware-rewrite')).toContain(
      '/en-US/pvt/account'
    )
    expect(response.headers.get(CSP)).toMatch(/^default-src 'self'; /)
    expect(response.headers.get(CSP_RO)).toBeNull()
  })

  it('does not call data-plane nor add CSP headers on the unlock redirect', async () => {
    const redirect = NextResponse.redirect(
      new URL(
        '/password-protection?returnTo=%2Fproducts',
        'https://store.example.com'
      )
    )
    checkStoreProtectionMock.mockResolvedValue({ response: redirect })
    fetchMock.mockResolvedValue(jsonResponse(record()))
    const proxy = await loadProxy()

    const response = await proxy(request())

    expect(response).toBe(redirect)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(response.headers.get(CSP)).toBeNull()
    expect(response.headers.get(CSP_RO)).toBeNull()
    expect(response.headers.get('Reporting-Endpoints')).toBeNull()
  })

  it('does not call data-plane when the protection check throws', async () => {
    checkStoreProtectionMock.mockRejectedValue(new Error('access check failed'))
    const proxy = await loadProxy()

    const response = await proxy(request())

    expect(response.type).toBe('error')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('serves the request without CSP headers when data-plane is down', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))
    const proxy = await loadProxy()

    const response = (await proxy(request())) as NextResponse

    expect(response.status).toBe(200)
    expect(response.headers.get('x-middleware-next')).toBe('1')
    expect(response.headers.get(CSP)).toBeNull()
    expect(response.headers.get(CSP_RO)).toBeNull()
  })

  it('sends no CSP header when the store has no record', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'not found' }, 404))
    const proxy = await loadProxy()

    const response = (await proxy(request())) as NextResponse

    expect(response.status).toBe(200)
    expect(response.headers.get(CSP)).toBeNull()
    expect(response.headers.get(CSP_RO)).toBeNull()
  })

  it('reads the settings from the default WebOps origin when DATA_PLANE_API_URL is unset', async () => {
    delete process.env.DATA_PLANE_API_URL
    fetchMock.mockResolvedValue(jsonResponse(record()))
    const proxy = await loadProxy()

    const response = (await proxy(request())) as NextResponse

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://faststore.vtex.com/api/v1/csp/settings?storeId=test-store'
    )
    expect(response.headers.get(CSP_RO)).toContain("default-src 'self'")
  })
})
