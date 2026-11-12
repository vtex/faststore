import type { NextApiRequest, NextApiResponse } from 'next'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest'

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: { api: { storeId: 'test-store' }, experimental: {} },
}))

import handler from '../../../src/pages/api/fs/delegation-return'

const ORDER_FORM_COOKIES =
  'checkout.vtex.com=__ofid=abc123; CheckoutOrderFormOwnership=owner-1'
const AUTH_COOKIE = 'VtexIdclientAutCookie_test-store=impersonated-token'

function createReqRes(overrides: Partial<NextApiRequest> = {}) {
  const res = {
    status: vi.fn().mockImplementation(function (this: unknown) {
      return this
    }),
    json: vi.fn(),
    end: vi.fn(),
    setHeader: vi.fn(),
  } as unknown as NextApiResponse & {
    status: Mock
    json: Mock
    end: Mock
    setHeader: Mock
  }

  const req = {
    method: 'POST',
    body: undefined,
    query: {},
    ...overrides,
    headers: {
      host: 'store.example.com',
      cookie: `${AUTH_COOKIE}; ${ORDER_FORM_COOKIES}`,
      ...overrides.headers,
    },
  } as unknown as NextApiRequest

  return { req, res }
}

const okResponse = (body: unknown) =>
  ({ ok: true, status: 200, json: async () => body }) as Response

describe('/api/fs/delegation-return', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('rejects methods other than POST', async () => {
    const { req, res } = createReqRes({ method: 'GET' })
    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('relays to Identity with the cookie and no redirect following', async () => {
    fetchMock.mockResolvedValue(
      okResponse({ accessToken: 'delegate-token', expiresIn: 3600 })
    )
    const { req, res } = createReqRes()
    await handler(req, res)

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(
      'https://test-store.myvtex.com/api/authenticator/v1/storefront/token/delegation/return?an=test-store'
    )
    expect(init.method).toBe('POST')
    expect(init.redirect).toBe('error')
    expect(init.body).toBeUndefined()
    expect(init.headers.cookie).toContain(AUTH_COOKIE)
  })

  it('swaps the auth cookie and expires the orderForm in one batch', async () => {
    fetchMock.mockResolvedValue(
      okResponse({ accessToken: 'delegate-token', expiresIn: 3600 })
    )
    const { req, res } = createReqRes()
    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true })

    const cookies = res.setHeader.mock.calls[0][1] as string[]
    expect(res.setHeader.mock.calls[0][0]).toBe('Set-Cookie')
    expect(
      cookies.some((c) =>
        c.startsWith('VtexIdclientAutCookie_test-store=delegate-token')
      )
    ).toBe(true)
    expect(cookies.some((c) => c.startsWith('checkout.vtex.com=;'))).toBe(true)
  })

  it.each([401, 403])(
    'maps upstream %i to 403 without cookies',
    async (status) => {
      fetchMock.mockResolvedValue({ ok: false, status } as Response)
      const { req, res } = createReqRes()
      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.setHeader).not.toHaveBeenCalled()
    }
  )

  it('maps other upstream failures to 502 without cookies', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 } as Response)
    const { req, res } = createReqRes()
    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('fails closed when no access token comes back', async () => {
    fetchMock.mockResolvedValue(okResponse({ expiresIn: 3600 }))
    const { req, res } = createReqRes()
    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('answers 504 on timeout and 502 on other network errors', async () => {
    const timeout = Object.assign(new Error('t'), { name: 'TimeoutError' })
    fetchMock.mockRejectedValueOnce(timeout)
    const first = createReqRes()
    await handler(first.req, first.res)
    expect(first.res.status).toHaveBeenCalledWith(504)

    fetchMock.mockRejectedValueOnce(new Error('boom'))
    const second = createReqRes()
    await handler(second.req, second.res)
    expect(second.res.status).toHaveBeenCalledWith(502)
    expect(second.res.setHeader).not.toHaveBeenCalled()
  })

  it('does not log credentials on failure', async () => {
    fetchMock.mockRejectedValue(new Error(`leak ${AUTH_COOKIE}`))
    const { req, res } = createReqRes()
    await handler(req, res)

    const logged = JSON.stringify((console.error as Mock).mock.calls)
    expect(logged).not.toContain('impersonated-token')
  })
})
