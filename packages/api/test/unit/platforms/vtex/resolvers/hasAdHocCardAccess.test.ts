import { describe, expect, it, vi } from 'vitest'

import { Query } from '../../../../../src/platforms/vtex/resolvers/query'

const ACCOUNT = 'storeaccount'

/**
 * Minimal unsigned JWT carrying the claims the resolver reads. The resolver
 * only base64-decodes the payload, so the header/signature are placeholders.
 */
const makeJwt = (payload: Record<string, unknown>) =>
  `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`

const makeContext = (jwtPayload: Record<string, unknown> | null) => ({
  account: ACCOUNT,
  headers: {
    cookie: jwtPayload
      ? `VtexIdclientAutCookie_${ACCOUNT}=${makeJwt(jwtPayload)}`
      : '',
  },
  clients: {
    commerce: {
      licenseManager: {
        isResourceGranted: vi.fn(),
      },
    },
  },
})

describe('hasAdHocCardAccess', () => {
  it('asks License Manager for the UseAdHocCard key using the userId from the token', async () => {
    const ctx = makeContext({ userId: 'user-1', unitId: 'unit-1' })
    ctx.clients.commerce.licenseManager.isResourceGranted.mockResolvedValueOnce(
      true
    )

    const result = await Query.hasAdHocCardAccess(null, undefined, ctx as any)

    expect(
      ctx.clients.commerce.licenseManager.isResourceGranted
    ).toHaveBeenCalledWith({
      userId: 'user-1',
      resourceKey: 'UseAdHocCard',
    })
    expect(result).toBe(true)
  })

  it('returns false when License Manager denies the key', async () => {
    const ctx = makeContext({ userId: 'user-1', unitId: 'unit-1' })
    ctx.clients.commerce.licenseManager.isResourceGranted.mockResolvedValueOnce(
      false
    )

    const result = await Query.hasAdHocCardAccess(null, undefined, ctx as any)

    expect(result).toBe(false)
  })

  it('fails open when License Manager errors, so an outage never locks buyers out', async () => {
    const ctx = makeContext({ userId: 'user-1', unitId: 'unit-1' })
    ctx.clients.commerce.licenseManager.isResourceGranted.mockRejectedValueOnce(
      new Error('license-manager unavailable')
    )

    const result = await Query.hasAdHocCardAccess(null, undefined, ctx as any)

    expect(result).toBe(true)
  })

  it('fails open when the service answers with a non-boolean payload', async () => {
    const ctx = makeContext({ userId: 'user-1' })
    ctx.clients.commerce.licenseManager.isResourceGranted.mockResolvedValueOnce(
      undefined as unknown as boolean
    )

    const result = await Query.hasAdHocCardAccess(null, undefined, ctx as any)

    expect(result).toBe(true)
  })

  it('skips the call entirely when no userId can be resolved from the token', async () => {
    const ctx = makeContext(null)

    const result = await Query.hasAdHocCardAccess(null, undefined, ctx as any)

    expect(
      ctx.clients.commerce.licenseManager.isResourceGranted
    ).not.toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('does not throw when the auth cookie is malformed, and skips the call', async () => {
    const ctx = {
      account: ACCOUNT,
      headers: { cookie: `VtexIdclientAutCookie_${ACCOUNT}=not-a-jwt` },
      clients: {
        commerce: { licenseManager: { isResourceGranted: vi.fn() } },
      },
    }

    const result = await Query.hasAdHocCardAccess(null, undefined, ctx as any)

    expect(
      ctx.clients.commerce.licenseManager.isResourceGranted
    ).not.toHaveBeenCalled()
    expect(result).toBe(true)
  })
})
