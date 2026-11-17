import { describe, expect, it, vi } from 'vitest'

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
            .mockRejectedValue(new Error('Not Found')),
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

  it('still resolves the order when the shopper lookup fails', async () => {
    const { ctx, getShopperById } = makeCtx({
      ...baseOrder,
      purchaseAgentData: { purchaseAgents: [{ userId: 'user-1' }] },
    })
    getShopperById.mockRejectedValueOnce(new Error('MasterData down'))

    const result = await Query.userOrder(
      null,
      { orderId: baseOrder.orderId },
      ctx
    )

    expect(result.orderId).toBe(baseOrder.orderId)
    expect(result.shopper).toEqual(emptyShopper)
  })
})
