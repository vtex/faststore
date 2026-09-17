import type { NextApiRequest, NextApiResponse } from 'next'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import type { SwitchContractResponse } from '../../../src/pages/api/fs/switch-contract'

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: { api: { storeId: 'test-store' } },
}))

const CONTRACT_ID = '69b5d80e-8f61-44e0-a5cb-db54c326699c'
const ORDER_FORM_COOKIES =
  'checkout.vtex.com=__ofid=abc123; CheckoutOrderFormOwnership=owner-1'
const AUTH_COOKIE = 'VtexIdclientAutCookie_test-store=old-token'

const successPayload = {
  authStatus: 'Success',
  expiresIn: 3600,
  authCookie: {
    Name: 'VtexIdclientAutCookie_test-store',
    Value: 'new-contract-token',
  },
  accountAuthCookie: null,
}

function createReqRes(overrides: Partial<NextApiRequest> = {}): {
  req: NextApiRequest
  res: NextApiResponse<SwitchContractResponse> & {
    status: Mock
    json: Mock
    end: Mock
    setHeader: Mock
  }
} {
  const res: Record<string, unknown> = {
    status: vi.fn().mockImplementation(function (this: unknown) {
      return this
    }),
    json: vi.fn(),
    end: vi.fn(),
    setHeader: vi.fn(),
  }

  return {
    req: {
      method: 'POST',
      body: { contractId: CONTRACT_ID },
      query: {},
      ...overrides,
      headers: {
        host: 'store.example.com',
        cookie: `${AUTH_COOKIE}; ${ORDER_FORM_COOKIES}`,
        'x-forwarded-proto': 'https',
        ...overrides.headers,
      },
    } as unknown as NextApiRequest,
    res: res as unknown as ReturnType<typeof createReqRes>['res'],
  }
}

async function getHandler() {
  const mod = await import('../../../src/pages/api/fs/switch-contract')
  return mod.default
}

const setCookiesFrom = (res: { setHeader: Mock }): string[] => {
  const call = res.setHeader.mock.calls.find(
    ([name]) => String(name).toLowerCase() === 'set-cookie'
  )

  return (call?.[1] as string[] | undefined) ?? []
}

describe('/api/fs/switch-contract', () => {
  beforeEach(() => {
    vi.resetModules()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => successPayload,
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns 405 for non-POST requests', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({ method: 'GET' })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.end).toHaveBeenCalled()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns 400 when contractId is missing', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({ body: {} })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'contractId is required',
      })
    )
  })

  it('returns 400 when the body is missing', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({ body: undefined })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('returns 400 when contractId is not a string', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({ body: { contractId: 42 } })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('relays to switch-properties forwarding the buyer cookie', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const [url, init] = (global.fetch as Mock).mock.calls[0]

    expect(url).toBe(
      'https://test-store.myvtex.com/api/authenticator/storefront/credential/switch-properties?an=test-store'
    )
    expect(init.method).toBe('POST')
    expect(init.headers.cookie).toBe(`${AUTH_COOKIE}; ${ORDER_FORM_COOKIES}`)
    expect(init.signal).toBeDefined()
    expect(JSON.parse(init.body as string)).toEqual({
      properties: { customerId: CONTRACT_ID },
    })
  })

  it('emits the new auth cookie and the orderForm expiry in one batch', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    const cookies = setCookiesFrom(res)

    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'VtexIdclientAutCookie_test-store=new-contract-token'
        ),
      ])
    )
    expect(
      cookies.filter((cookie) => cookie.startsWith('checkout.vtex.com=;'))
        .length
    ).toBeGreaterThan(0)
    expect(
      cookies.filter((cookie) =>
        cookie.startsWith('CheckoutOrderFormOwnership=;')
      ).length
    ).toBeGreaterThan(0)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true })
  })

  it('carries Max-Age from expiresIn and Secure behind https', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    const authCookie = setCookiesFrom(res).find((cookie) =>
      cookie.startsWith('VtexIdclientAutCookie_test-store=')
    )

    expect(authCookie).toContain('Max-Age=3600')
    expect(authCookie).toContain('Path=/')
    expect(authCookie).toContain('SameSite=Lax')
    expect(authCookie).toContain('Secure')
  })

  it('omits Secure on plain http', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({
      headers: { 'x-forwarded-proto': 'http' },
    })

    await handler(req, res)

    const authCookie = setCookiesFrom(res).find((cookie) =>
      cookie.startsWith('VtexIdclientAutCookie_test-store=')
    )

    expect(authCookie).not.toContain('Secure')
  })

  it('also emits the accountAuthCookie when present', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ...successPayload,
        accountAuthCookie: {
          Name: 'VtexIdclientAutCookie_account',
          Value: 'account-token',
        },
      }),
    })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(setCookiesFrom(res)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('VtexIdclientAutCookie_account=account-token'),
      ])
    )
  })

  it('does not expire orderForm cookies that the request does not carry', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({ headers: { cookie: AUTH_COOKIE } })

    await handler(req, res)

    const cookies = setCookiesFrom(res)

    expect(
      cookies.some((cookie) => cookie.startsWith('checkout.vtex.com=;'))
    ).toBe(false)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('returns 401 and sets no cookies when the upstream rejects the token', async () => {
    ;(global.fetch as Mock).mockResolvedValue({ ok: false, status: 401 })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('maps upstream 403 to 401', async () => {
    ;(global.fetch as Mock).mockResolvedValue({ ok: false, status: 403 })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('returns 502 and sets no cookies on other upstream failures', async () => {
    ;(global.fetch as Mock).mockResolvedValue({ ok: false, status: 500 })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('returns 502 and sets no cookies when authStatus is not success', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ...successPayload, authStatus: 'WrongCredentials' }),
    })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('returns 502 and sets no cookies when no auth cookie comes back', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ...successPayload, authCookie: null }),
    })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('returns 504 when the upstream call times out', async () => {
    const timeout = new Error('aborted')
    timeout.name = 'TimeoutError'
    ;(global.fetch as Mock).mockRejectedValue(timeout)
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(504)
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('returns 502 when the upstream call throws', async () => {
    ;(global.fetch as Mock).mockRejectedValue(new Error('network failure'))
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('does not log the error object, only its name', async () => {
    ;(global.fetch as Mock).mockRejectedValue(new Error('token=super-secret'))
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    const logged = (console.error as Mock).mock.calls.flat().join(' ')

    expect(logged).not.toContain('super-secret')
    expect(logged).toContain('Error')
  })
})
