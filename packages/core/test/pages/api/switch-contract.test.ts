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

  it('refuses to follow redirects so the cookie cannot leak cross-origin', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    const [, init] = (global.fetch as Mock).mock.calls[0]

    expect(init.redirect).toBe('error')
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

  it('writes the auth cookie with the same scope VTEX ID uses', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    const authCookie = setCookiesFrom(res).find((cookie) =>
      cookie.startsWith('VtexIdclientAutCookie_test-store=new-contract-token')
    )

    expect(authCookie).toBe(
      'VtexIdclientAutCookie_test-store=new-contract-token; Domain=store.example.com; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=None'
    )
  })

  it('stays Secure even when the proxy forwards plain http', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({
      headers: { 'x-forwarded-proto': 'http' },
    })

    await handler(req, res)

    const authCookie = setCookiesFrom(res).find((cookie) =>
      cookie.startsWith('VtexIdclientAutCookie_test-store=new-contract-token')
    )

    expect(authCookie).toContain('; Secure')
  })

  it('expires a leftover host-only auth cookie before setting the scoped one', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    const authCookies = setCookiesFrom(res).filter((cookie) =>
      cookie.startsWith('VtexIdclientAutCookie_test-store=')
    )

    expect(authCookies).toHaveLength(2)
    expect(authCookies[0]).toMatch(/^VtexIdclientAutCookie_test-store=;/)
    expect(authCookies[0]).toContain('max-age=0')
    expect(authCookies[0]).toContain('path=/')
    // Host-only: no Domain, so it cannot touch VTEX ID's scoped cookie.
    expect(authCookies[0].toLowerCase()).not.toContain('domain=')
    expect(authCookies[1]).toContain('Domain=store.example.com')
  })

  it('strips the port from the Host header', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({
      headers: { host: 'store.example.com:443' },
    })

    await handler(req, res)

    expect(setCookiesFrom(res)).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'new-contract-token; Domain=store.example.com; Path=/'
        ),
      ])
    )
  })

  it.each([
    ['zero', 0],
    ['negative', -1],
    ['fractional', 1.5],
    ['a numeric string', '3600'],
    ['not a number', 'soon'],
    ['missing', undefined],
  ])(
    'falls back to the default Max-Age when expiresIn is %s',
    async (_label, expiresIn) => {
      ;(global.fetch as Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ...successPayload, expiresIn }),
      })
      const handler = await getHandler()
      const { req, res } = createReqRes()

      await handler(req, res)

      const authCookie = setCookiesFrom(res).find((cookie) =>
        cookie.startsWith('VtexIdclientAutCookie_test-store=new-contract-token')
      )

      // Max-Age=0 would delete the very credential this response installs.
      expect(authCookie).toContain('Max-Age=86400')
      expect(res.status).toHaveBeenCalledWith(200)
    }
  )

  it.each([
    ['localhost', 'localhost:3000'],
    ['127.0.0.1', '127.0.0.1:3000'],
    ['a LAN IP', '192.168.1.10'],
    ['an unsafe host', 'store.example.com;evil=1'],
  ])('writes a single host-only cookie on %s', async (_label, host) => {
    const handler = await getHandler()
    const { req, res } = createReqRes({
      headers: { host, 'x-forwarded-proto': 'http' },
    })

    await handler(req, res)

    const authCookies = setCookiesFrom(res).filter((cookie) =>
      cookie.startsWith('VtexIdclientAutCookie_test-store=')
    )

    // No Domain means the cookie already replaces the host-only one, so
    // expiring it in the same batch would delete the new credential.
    expect(authCookies).toEqual([
      'VtexIdclientAutCookie_test-store=new-contract-token; Path=/; Max-Age=3600; HttpOnly; SameSite=Lax',
    ])
  })

  it.each([
    ['a LAN IP', '192.168.1.10'],
    ['an IPv6 literal', '[2001:db8::1]'],
  ])(
    'keeps the host-only cookie Secure on %s over https',
    async (_label, host) => {
      const handler = await getHandler()
      const { req, res } = createReqRes({
        headers: { host, 'x-forwarded-proto': 'https' },
      })

      await handler(req, res)

      const authCookies = setCookiesFrom(res).filter((cookie) =>
        cookie.startsWith('VtexIdclientAutCookie_test-store=')
      )

      expect(authCookies).toEqual([
        'VtexIdclientAutCookie_test-store=new-contract-token; Path=/; Max-Age=3600; HttpOnly; SameSite=Lax; Secure',
      ])
    }
  )

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

    const cookies = setCookiesFrom(res)

    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^VtexIdclientAutCookie_account=;.*max-age=0/),
        expect.stringContaining(
          'VtexIdclientAutCookie_account=account-token; Domain=store.example.com'
        ),
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
