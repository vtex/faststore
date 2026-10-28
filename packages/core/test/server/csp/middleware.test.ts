import { NextRequest, NextResponse } from 'next/server'

const mockCheckStoreProtection = jest.fn()

jest.mock('../../../discovery.config', () => ({
  __esModule: true,
  default: {
    api: { storeId: 'mystore' },
    storeUrl: 'https://mystore.example.com',
  },
}))

jest.mock('../../../src/server/password-protection-service', () => ({
  PasswordProtectionService: jest.fn().mockImplementation(() => ({
    checkStoreProtection: mockCheckStoreProtection,
  })),
}))

type Middleware = typeof import('../../../src/middleware')['middleware']

function settingsResponse(): Response {
  return new Response(
    JSON.stringify({
      schemaVersion: 1,
      storeId: 'mystore',
      mode: 'report-only',
      frameAncestors: { mode: 'enforce', sources: ["'self'"] },
      updatedAt: '2026-10-26T00:00:00.000Z',
      version: 1,
    }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  )
}

describe('middleware CSP wiring', () => {
  const originalOrigin = process.env.DATA_PLANE_API_URL
  const originalFetch = global.fetch
  let middleware: Middleware

  beforeEach(() => {
    process.env.DATA_PLANE_API_URL = 'https://data-plane.example.com'
    global.fetch = jest.fn().mockImplementation(async () => settingsResponse())
    jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    mockCheckStoreProtection.mockReset()

    // Fresh module state (settings cache) for each test.
    jest.isolateModules(() => {
      middleware = require('../../../src/middleware').middleware
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    global.fetch = originalFetch

    if (originalOrigin === undefined) {
      delete process.env.DATA_PLANE_API_URL
    } else {
      process.env.DATA_PLANE_API_URL = originalOrigin
    }
  })

  const request = () => new NextRequest('https://mystore.example.com/office')

  it('adds the CSP headers to the pass-through response', async () => {
    const passThrough = NextResponse.next()
    mockCheckStoreProtection.mockResolvedValue({ response: passThrough })

    const response = await middleware(request())

    expect(response).toBe(passThrough)
    expect(response.headers.get('Content-Security-Policy')).toContain(
      "frame-ancestors 'self'"
    )
    expect(
      response.headers.get('Content-Security-Policy-Report-Only')
    ).toContain("default-src 'self'")
    expect(response.headers.get('Reporting-Endpoints')).toContain(
      'account=mystore'
    )
    expect(global.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'https://data-plane.example.com/api/v1/csp/settings?storeId=mystore',
      }),
      expect.any(Object)
    )
  })

  it('does not add CSP headers to the password unlock redirect', async () => {
    const unlockRedirect = NextResponse.redirect(
      'https://mystore.example.com/password-protection?returnTo=%2Foffice'
    )
    mockCheckStoreProtection.mockResolvedValue({ response: unlockRedirect })

    const response = await middleware(request())

    expect(response).toBe(unlockRedirect)
    expect(response.headers.get('Content-Security-Policy')).toBeNull()
    expect(
      response.headers.get('Content-Security-Policy-Report-Only')
    ).toBeNull()
    expect(response.headers.get('Reporting-Endpoints')).toBeNull()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('does not add CSP headers when password protection throws', async () => {
    mockCheckStoreProtection.mockRejectedValue(new Error('boom'))

    const response = await middleware(request())

    expect(response.status).not.toBe(200)
    expect(response.headers.get('Content-Security-Policy')).toBeNull()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('serves the page without CSP headers when data-plane is down', async () => {
    const passThrough = NextResponse.next()
    mockCheckStoreProtection.mockResolvedValue({ response: passThrough })
    ;(global.fetch as jest.Mock).mockRejectedValue(
      new TypeError('fetch failed')
    )

    const response = await middleware(request())

    expect(response).toBe(passThrough)
    expect(response.status).toBe(200)
    expect(response.headers.get('Reporting-Endpoints')).toBeNull()
  })
})
