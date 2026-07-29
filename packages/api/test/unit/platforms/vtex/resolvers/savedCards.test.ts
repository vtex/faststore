import { describe, expect, it, vi } from 'vitest'

import { Query } from '../../../../../src/platforms/vtex/resolvers/query'

const makeContext = (overrides = {}) => ({
  clients: {
    commerce: {
      savedCards: {
        listCreditCards: vi.fn(),
      },
    },
  },
  ...overrides,
})

describe('listCreditCards', () => {
  it('maps the bare array returned by the Saved-cards service into { list }', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.savedCards.listCreditCards.mockResolvedValueOnce([
      {
        accountId: 'acc-1',
        bin: '411111',
        cardNumber: '**** **** **** 1111',
        paymentSystem: '2',
        paymentSystemName: 'Visa',
        isDefault: true,
        isActive: true,
      },
    ])

    const result = await Query.listCreditCards(null, undefined, ctx as any)

    expect(result).toEqual({
      list: [
        {
          accountId: 'acc-1',
          bin: '411111',
          cardNumber: '**** **** **** 1111',
          paymentSystem: '2',
          paymentSystemName: 'Visa',
          isDefault: true,
          isActive: true,
        },
      ],
    })
  })

  it('returns an empty list when the service has no saved cards', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.savedCards.listCreditCards.mockResolvedValueOnce([])

    const result = await Query.listCreditCards(null, undefined, ctx as any)

    expect(result).toEqual({ list: [] })
  })
})
