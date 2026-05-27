import type { NextApiRequest, NextApiResponse } from 'next'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import type { LoginResponse } from '../../../src/utils/loginResponse'

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: { api: { storeId: 'test-store' } },
}))

vi.mock('../../../src/server/password-protection/webops-api', () => ({
  sessionUrl: () =>
    new URL('https://faststore.vtex.com/api/v1/password-protection/session'),
  passwordProtectionTimeouts: { defaultMs: 10_000 },
}))

function createReqRes(overrides: Partial<NextApiRequest> = {}): {
  req: NextApiRequest
  res: NextApiResponse<LoginResponse> & {
    status: Mock
    json: Mock
    end: Mock
    setHeader: Mock
    _getStatus: () => number
  }
} {
  const res: Record<string, unknown> = {
    _status: 0,
    status: vi.fn().mockImplementation(function (
      this: Record<string, unknown>,
      code: number
    ) {
      this._status = code
      return this
    }),
    json: vi.fn(),
    end: vi.fn(),
    setHeader: vi.fn(),
    _getStatus() {
      return (this as Record<string, unknown>)._status
    },
  }

  return {
    req: {
      method: 'POST',
      body: { password: 'secret' },
      query: {},
      ...overrides,
    } as unknown as NextApiRequest,
    res: res as unknown as ReturnType<typeof createReqRes>['res'],
  }
}

async function getHandler() {
  const mod = await import('../../../src/pages/api/fs/auth/login')
  return mod.default
}

describe('/api/fs/auth/login', () => {
  beforeEach(() => {
    vi.resetModules()
    global.fetch = vi.fn()
  })

  it('returns 405 for non-POST requests', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({ method: 'GET' })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.end).toHaveBeenCalled()
  })

  it('returns 400 when password is missing', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({ body: {} })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'Password is required' })
    )
  })

  it('returns 400 when password is not a string', async () => {
    const handler = await getHandler()
    const { req, res } = createReqRes({ body: { password: 123 } })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('returns 401 when WebOps returns 401', async () => {
    ;(global.fetch as Mock).mockResolvedValue({ ok: false, status: 401 })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'Invalid password' })
    )
  })

  it('returns 401 when WebOps returns 403', async () => {
    ;(global.fetch as Mock).mockResolvedValue({ ok: false, status: 403 })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('returns 503 when WebOps returns a non-ok status other than 401/403', async () => {
    ;(global.fetch as Mock).mockResolvedValue({ ok: false, status: 502 })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    )
  })

  it('returns 500 when WebOps response body is not a valid payload', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => 'not-an-object',
    })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })

  it('returns 401 when WebOps responds with valid=false', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ valid: false }),
    })
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'Invalid password' })
    )
  })

  it('sets auth cookie and returns 200 with redirectUrl on success', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ valid: true, token: 'jwt-abc' }),
    })
    const handler = await getHandler()
    const { req, res } = createReqRes({ query: { returnTo: '/checkout' } })

    await handler(req, res)

    expect(res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.arrayContaining([
        expect.stringContaining('__fs_auth_token=jwt-abc'),
      ])
    )
    expect(res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.arrayContaining([expect.stringContaining('HttpOnly')])
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, redirectUrl: '/checkout' })
    )
  })

  it('defaults redirectUrl to "/" when returnTo is not provided', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ valid: true, token: 'jwt-abc' }),
    })
    const handler = await getHandler()
    const { req, res } = createReqRes({ query: {} })

    await handler(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, redirectUrl: '/' })
    )
  })

  it('sanitizes open-redirect attempts in returnTo', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ valid: true, token: 'jwt-abc' }),
    })
    const handler = await getHandler()
    const { req, res } = createReqRes({ query: { returnTo: '//evil.com' } })

    await handler(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ redirectUrl: '/' })
    )
  })

  it('sanitizes absolute URL in returnTo', async () => {
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ valid: true, token: 'jwt-abc' }),
    })
    const handler = await getHandler()
    const { req, res } = createReqRes({
      query: { returnTo: 'https://evil.com' },
    })

    await handler(req, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ redirectUrl: '/' })
    )
  })

  it('returns 503 when fetch throws', async () => {
    ;(global.fetch as Mock).mockRejectedValue(new Error('network failure'))
    const handler = await getHandler()
    const { req, res } = createReqRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    )
  })
})
