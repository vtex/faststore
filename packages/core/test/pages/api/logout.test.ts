import type { NextApiRequest, NextApiResponse } from 'next'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

const mockConfig = vi.hoisted(() => ({
  default: {
    experimental: { refreshToken: true } as Record<string, unknown>,
  } as { experimental: Record<string, unknown>; secureSubdomain?: string },
}))

vi.mock('discovery.config', () => ({ __esModule: true, ...mockConfig }))

function createReqRes(cookie = 'VtexIdclientAutCookie_test-store=token') {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    end: vi.fn(),
    setHeader: vi.fn(),
  }

  return {
    req: {
      method: 'POST',
      headers: { host: 'store.example.com', cookie },
    } as unknown as NextApiRequest,
    res: res as unknown as NextApiResponse & { setHeader: Mock },
  }
}

const setCookiesFrom = (res: { setHeader: Mock }): string[] =>
  (res.setHeader.mock.calls.find(
    ([name]) => String(name).toLowerCase() === 'set-cookie'
  )?.[1] as string[] | undefined) ?? []

async function getHandler() {
  const mod = await import('../../../src/pages/api/fs/logout')
  return mod.default
}

describe('/api/fs/logout', () => {
  beforeEach(() => {
    vi.resetModules()
    mockConfig.default.experimental = { refreshToken: true }
    mockConfig.default.secureSubdomain = undefined
  })

  it('expires vid_rt on every path it can be scoped to, even though the request never carries it', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    const vidRt = setCookiesFrom(res).filter((cookie) =>
      cookie.startsWith('vid_rt=;')
    )

    for (const path of [
      '/api/vtexid/refreshtoken/webstore',
      '/api/authenticator/refreshtoken/webstore',
      '/api/authenticator/v1/refreshtoken/webstore',
    ]) {
      expect(vidRt.some((cookie) => cookie.includes(`path=${path}`))).toBe(true)
    }
  })

  it('does not touch vid_rt when refresh token is disabled', async () => {
    mockConfig.default.experimental = {}
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(
      setCookiesFrom(res).some((cookie) => cookie.startsWith('vid_rt='))
    ).toBe(false)
  })

  it('expires the auth cookie on the parent shared with a sibling checkout host', async () => {
    mockConfig.default.secureSubdomain = 'https://secure.example.com'
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(
      setCookiesFrom(res).filter((cookie) =>
        cookie.startsWith('VtexIdclientAutCookie_test-store=;')
      )
    ).toEqual(
      expect.arrayContaining([expect.stringContaining('; domain=example.com;')])
    )
  })

  it('does not touch the parent domain when checkout runs on the store host', async () => {
    mockConfig.default.secureSubdomain = 'https://store.example.com'
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(
      setCookiesFrom(res).some((cookie) =>
        cookie.includes('; domain=example.com;')
      )
    ).toBe(false)
  })
})
