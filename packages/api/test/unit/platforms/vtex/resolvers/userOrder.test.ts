import { describe, expect, it, vi } from 'vitest'

import {
  FastStoreError,
  NotFoundError,
} from '../../../../../src/platforms/errors'
import { Query } from '../../../../../src/platforms/vtex/resolvers/query'

const makeCtx = (order: Record<string, unknown>) => {
  const getShopperById = vi.fn()
  const ctx = {
    clients: {
      commerce: {
        oms: {
          userOrder: vi.fn().mockResolvedValue(order),
          getCommercialAuthorizationsByOrderId: vi
            .fn()
            .mockRejectedValue(new NotFoundError('Not Found')),
        },
        masterData: { getShopperById },
      },
    },
  } as any

  return { ctx, getShopperById }
}

const baseOrder = {
  orderId: '1234567890-01',
  status: 'invoiced',
}

const emptyShopper = { firstName: '', lastName: '', email: '', phone: '' }

describe('Query.userOrder', () => {
  it('resolves an order without purchaseAgentData and skips the shopper lookup', async () => {
    const { ctx, getShopperById } = makeCtx(baseOrder)

    const result = await Query.userOrder(
      null,
      { orderId: baseOrder.orderId },
      ctx
    )

    expect(result.orderId).toBe(baseOrder.orderId)
    expect(result.shopper).toEqual(emptyShopper)
    expect(getShopperById).not.toHaveBeenCalled()
  })

  it('resolves an order whose purchase agent has no userId', async () => {
    const { ctx, getShopperById } = makeCtx({
      ...baseOrder,
      purchaseAgentData: { purchaseAgents: [{}] },
    })

    const result = await Query.userOrder(
      null,
      { orderId: baseOrder.orderId },
      ctx
    )

    expect(result.shopper).toEqual(emptyShopper)
    expect(getShopperById).not.toHaveBeenCalled()
  })

  it('fills the shopper from the purchase agent', async () => {
    const { ctx, getShopperById } = makeCtx({
      ...baseOrder,
      purchaseAgentData: { purchaseAgents: [{ userId: 'user-1' }] },
    })
    getShopperById.mockResolvedValueOnce([
      {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: '+1000',
      },
    ])

    const result = await Query.userOrder(
      null,
      { orderId: baseOrder.orderId },
      ctx
    )

    expect(getShopperById).toHaveBeenCalledWith({ userId: 'user-1' })
    expect(result.shopper).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '+1000',
    })
  })

  it('still resolves the order and logs when the shopper lookup fails', async () => {
    const { ctx, getShopperById } = makeCtx({
      ...baseOrder,
      purchaseAgentData: { purchaseAgents: [{ userId: 'user-1' }] },
    })
    const error = new Error('MasterData down')
    getShopperById.mockRejectedValueOnce(error)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = await Query.userOrder(
      null,
      { orderId: baseOrder.orderId },
      ctx
    )

    expect(result.orderId).toBe(baseOrder.orderId)
    expect(result.shopper).toEqual(emptyShopper)
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(baseOrder.orderId),
      { status: undefined, message: 'MasterData down' }
    )
    warn.mockRestore()
  })

  it('falls back to an empty shopper when the search finds no record', async () => {
    const { ctx, getShopperById } = makeCtx({
      ...baseOrder,
      purchaseAgentData: { purchaseAgents: [{ userId: 'user-1' }] },
    })
    getShopperById.mockResolvedValueOnce([])

    const result = await Query.userOrder(
      null,
      { orderId: baseOrder.orderId },
      ctx
    )

    expect(result.shopper).toEqual(emptyShopper)
  })

  it('returns the pending authorization rule alongside the shopper', async () => {
    const { ctx, getShopperById } = makeCtx({
      ...baseOrder,
      status: 'waiting-for-authorization',
      purchaseAgentData: { purchaseAgents: [{ userId: 'user-1' }] },
    })
    const rule = { id: 'rule-1', status: 'pending', isUserNextAuthorizer: true }
    ctx.clients.commerce.oms.getCommercialAuthorizationsByOrderId.mockResolvedValueOnce(
      {
        id: 'auth-1',
        status: 'pending',
        dimensionStatus: [
          { id: 'dim-1', status: 'pending', ruleCollection: [rule] },
        ],
      }
    )
    getShopperById.mockResolvedValueOnce([{ firstName: 'Ada' }])

    const result = await Query.userOrder(
      null,
      { orderId: baseOrder.orderId },
      ctx
    )

    expect(result.ruleForAuthorization).toEqual({
      rule,
      orderAuthorizationId: 'auth-1',
      dimensionId: 'dim-1',
    })
    expect(result.canProcessOrderAuthorization).toBe(true)
    expect(result.shopper.firstName).toBe('Ada')
  })

  it('logs commercial authorization failures other than 404', async () => {
    const { ctx } = makeCtx(baseOrder)
    ctx.clients.commerce.oms.getCommercialAuthorizationsByOrderId.mockRejectedValueOnce(
      new FastStoreError({ status: 500, type: 'InternalServerError' }, 'boom')
    )
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = await Query.userOrder(
      null,
      { orderId: baseOrder.orderId },
      ctx
    )

    expect(result.ruleForAuthorization).toBeNull()
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('commercial authorization'),
      { status: 500, message: 'boom' }
    )
    warn.mockRestore()
  })

  it('does not log when the order has no commercial authorization (404)', async () => {
    const { ctx } = makeCtx(baseOrder)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await Query.userOrder(null, { orderId: baseOrder.orderId }, ctx)

    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })
})
