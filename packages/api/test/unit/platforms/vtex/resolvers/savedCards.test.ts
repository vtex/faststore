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
        origin: 'shared',
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
          origin: 'shared',
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

  it('passes through origin so the caller can distinguish personal from shared cards', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.savedCards.listCreditCards.mockResolvedValueOnce([
      { accountId: 'acc-shared', origin: 'shared' },
      { accountId: 'acc-personal', origin: 'personal' },
    ])

    const result = await Query.listCreditCards(null, undefined, ctx as any)

    expect(result.list.map((card: { origin: string }) => card.origin)).toEqual([
      'shared',
      'personal',
    ])
  })
})
