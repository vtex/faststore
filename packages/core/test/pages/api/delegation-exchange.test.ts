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

import handler from '../../../src/pages/api/fs/delegation-exchange'

const ORDER_FORM_COOKIES =
  'checkout.vtex.com=__ofid=abc123; CheckoutOrderFormOwnership=owner-1'
const AUTH_COOKIE = 'VtexIdclientAutCookie_test-store=delegate-token'

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
    body: { originalUserId: 'user-1', delegationId: 'delegation-1' },
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

describe('/api/fs/delegation-exchange', () => {
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

  it.each([
    [{ delegationId: 'd' }],
    [{ originalUserId: 'u' }],
    [{ originalUserId: 1, delegationId: 'd' }],
    [undefined],
  ])('rejects an invalid body %j', async (body) => {
    const { req, res } = createReqRes({ body })
    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('relays the token exchange with the buyer cookie', async () => {
    fetchMock.mockResolvedValue(
      okResponse({ accessToken: 'obo', tokenType: 'Bearer', expiresIn: 604800 })
    )
    const { req, res } = createReqRes()
    await handler(req, res)

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(
      'https://test-store.myvtex.com/api/authenticator/v1/storefront/token/delegation/exchange?an=test-store'
    )
    expect(init.redirect).toBe('error')
    expect(init.headers.cookie).toContain(AUTH_COOKIE)
    expect(JSON.parse(init.body)).toEqual({
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      originalUserId: 'user-1',
      delegationId: 'delegation-1',
    })
  })

  it('installs the impersonated cookie and expires the orderForm together', async () => {
    fetchMock.mockResolvedValue(
      okResponse({ accessToken: 'obo', tokenType: 'Bearer', expiresIn: 604800 })
    )
    const { req, res } = createReqRes()
    await handler(req, res)

    const cookies = res.setHeader.mock.calls[0][1] as string[]
    expect(
      cookies.some((c) => c.startsWith('VtexIdclientAutCookie_test-store=obo;'))
    ).toBe(true)
    expect(cookies.some((c) => c.includes('Max-Age=604800'))).toBe(true)
    expect(cookies.some((c) => c.startsWith('checkout.vtex.com=;'))).toBe(true)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true })
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

  it('fails closed when no access token is returned', async () => {
    fetchMock.mockResolvedValue(okResponse({ tokenType: 'Bearer' }))
    const { req, res } = createReqRes()
    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('maps a timeout to 504', async () => {
    const error = new Error('timeout')
    error.name = 'TimeoutError'
    fetchMock.mockRejectedValue(error)
    const { req, res } = createReqRes()
    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(504)
    expect(res.setHeader).not.toHaveBeenCalled()
  })
})
