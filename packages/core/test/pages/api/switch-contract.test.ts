import type { NextApiRequest, NextApiResponse } from 'next'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import type { SwitchContractResponse } from '../../../src/pages/api/fs/switch-contract'

const mockConfig = vi.hoisted(() => ({
  default: {
    api: { storeId: 'test-store' },
    experimental: { refreshToken: true } as Record<string, unknown>,
  },
}))

vi.mock('discovery.config', () => ({ __esModule: true, ...mockConfig }))

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

    expect(authCookies).toHaveLength(3)
    expect(authCookies[0]).toMatch(/^VtexIdclientAutCookie_test-store=;/)
    expect(authCookies[0]).toContain('max-age=0')
    expect(authCookies[0]).toContain('path=/')
    // Host-only: no Domain, so it cannot touch VTEX ID's scoped cookie.
    expect(authCookies[0].toLowerCase()).not.toContain('domain=')
    expect(authCookies[2]).toContain('Domain=store.example.com')
  })

  it('expires the copy VTEX ID refresh leaves on the parent domain', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    const authCookies = setCookiesFrom(res).filter((cookie) =>
      cookie.startsWith('VtexIdclientAutCookie_test-store=')
    )

    expect(authCookies[1]).toMatch(/^VtexIdclientAutCookie_test-store=;/)
    expect(authCookies[1]).toContain('max-age=0')
    expect(authCookies[1]).toContain('path=/')
    expect(authCookies[1]).toContain('domain=example.com')
    // The new token is never written to the parent domain.
    expect(
      authCookies.filter((cookie) => cookie.includes('new-contract-token'))
    ).toEqual([expect.stringContaining('Domain=store.example.com;')])
  })

  it.each([
    ['a single-label parent', 'store.com', []],
    ['a deep host', 'a.b.store.com', ['b.store.com', 'store.com']],
    ['a two-level suffix', 'www.store.com.br', ['store.com.br', 'com.br']],
    ['a .co.uk store', 'www.store.co.uk', ['store.co.uk', 'co.uk']],
    ['a .com.au store', 'shop.store.com.au', ['store.com.au', 'com.au']],
  ])('expires every parent domain for %s', async (_label, host, parents) => {
    const handler = await getHandler()
    const { req, res } = createReqRes({ headers: { host } })

    await handler(req, res)

    const expiredDomains = setCookiesFrom(res)
      .filter((cookie) =>
        cookie.startsWith('VtexIdclientAutCookie_test-store=;')
      )
      .map((cookie) => cookie.match(/domain=([^;]+)/)?.[1])
      .filter(Boolean)

    expect(expiredDomains).toEqual(parents)
  })

  it.each(['www.store.com.br', 'www.store.co.uk', 'shop.store.com.au'])(
    'writes the new token only on the request host for %s, never on a parent or public suffix',
    async (host) => {
      const handler = await getHandler()
      const { req, res } = createReqRes({ headers: { host } })

      await handler(req, res)

      // Parents (including public suffixes such as co.uk, which the browser
      // rejects) only ever get expiries; the token is scoped to the host.
      expect(
        setCookiesFrom(res).filter((cookie) =>
          cookie.includes('new-contract-token')
        )
      ).toEqual([expect.stringContaining(`; Domain=${host}; Path=/;`)])
    }
  )

  it.each([
    ['a preview Host', { host: 'sfj-abc--test-store.preview.vtex.app' }],
    [
      'a preview x-forwarded-host behind an internal Host',
      {
        host: 'discovery.internal',
        'x-forwarded-host': 'sfj-abc--test-store.preview.vtex.app',
      },
    ],
    ['a .localhost Host', { host: 'store.localhost:3000' }],
    ['a trailing-dot FQDN', { host: 'store.example.com.' }],
  ])('writes a single host-only cookie for %s', async (_label, headers) => {
    const handler = await getHandler()
    const { req, res } = createReqRes({ headers })

    await handler(req, res)

    const authCookies = setCookiesFrom(res).filter((cookie) =>
      cookie.startsWith('VtexIdclientAutCookie_test-store=')
    )

    expect(authCookies).toHaveLength(1)
    expect(authCookies[0]).toContain('new-contract-token; Path=/;')
    expect(authCookies[0].toLowerCase()).not.toContain('domain=')
  })

  it('does not let x-forwarded-host choose the Domain', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({
      headers: { 'x-forwarded-host': 'attacker.example.org' },
    })

    await handler(req, res)

    const cookies = setCookiesFrom(res)

    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'new-contract-token; Domain=store.example.com;'
        ),
      ])
    )
    expect(
      cookies.some((cookie) => cookie.includes('attacker.example.org'))
    ).toBe(false)
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
        'VtexIdclientAutCookie_test-store=new-contract-token; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Lax',
      ])
    }
  )

  it.each([
    ['plain http', false, ''],
    ['a TLS connection', true, '; Secure'],
  ])(
    'follows the connection without x-forwarded-proto on %s',
    async (_label, encrypted, secureAttr) => {
      const handler = await getHandler()
      const { req, res } = createReqRes({
        headers: { host: '192.168.1.10', 'x-forwarded-proto': undefined },
        socket: { encrypted } as unknown as NextApiRequest['socket'],
      })

      await handler(req, res)

      const authCookies = setCookiesFrom(res).filter((cookie) =>
        cookie.startsWith('VtexIdclientAutCookie_test-store=')
      )

      expect(authCookies).toEqual([
        `VtexIdclientAutCookie_test-store=new-contract-token; Path=/; Max-Age=3600; HttpOnly${secureAttr}; SameSite=Lax`,
      ])
    }
  )

  it('relays the upstream vid_rt re-scoped to the storefront host', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => successPayload,
      headers: {
        getSetCookie: () => [
          'vid_rt=rt-1; expires=Thu, 22 Oct 2027 00:00:00 GMT; domain=test-store.myvtex.com; path=/api/authenticator/v1/refreshtoken/webstore; secure; samesite=strict; httponly',
          'VtexIdclientAutCookie_test-store=upstream-token; domain=test-store.myvtex.com; path=/',
        ],
      },
    })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    const cookies = setCookiesFrom(res)
    const vidRt = cookies.filter((cookie) => cookie.startsWith('vid_rt='))

    expect(vidRt).toEqual([
      'vid_rt=rt-1; expires=Thu, 22 Oct 2027 00:00:00 GMT; path=/api/authenticator/v1/refreshtoken/webstore; secure; samesite=strict; httponly; Domain=store.example.com',
    ])
    // Only vid_rt is relayed; the auth cookie still comes from the payload.
    expect(cookies.some((cookie) => cookie.includes('upstream-token'))).toBe(
      false
    )
  })

  it('does not relay vid_rt when refresh token is disabled', async () => {
    mockConfig.default.experimental = {}
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => successPayload,
      headers: {
        getSetCookie: () => [
          'vid_rt=rt-1; domain=test-store.myvtex.com; path=/api/authenticator/v1/refreshtoken/webstore; secure; httponly',
        ],
      },
    })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    try {
      await handler(req, res)
    } finally {
      mockConfig.default.experimental = { refreshToken: true }
    }

    const cookies = setCookiesFrom(res)
    expect(cookies.some((cookie) => cookie.startsWith('vid_rt='))).toBe(false)
    // The contract switch itself still goes through.
    expect(
      cookies.some((cookie) => cookie.includes('new-contract-token'))
    ).toBe(true)
  })

  it('relays vid_rt host-only when the auth cookie is host-only', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => successPayload,
      headers: {
        getSetCookie: () => [
          'vid_rt=rt-1; domain=test-store.myvtex.com; path=/api/vtexid/refreshtoken/webstore; httponly',
        ],
      },
    })
    const handler = await getHandler()
    const { req, res } = createReqRes({ headers: { host: 'localhost:3000' } })

    await handler(req, res)

    expect(
      setCookiesFrom(res).filter((cookie) => cookie.startsWith('vid_rt='))
    ).toEqual(['vid_rt=rt-1; path=/api/vtexid/refreshtoken/webstore; httponly'])
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
