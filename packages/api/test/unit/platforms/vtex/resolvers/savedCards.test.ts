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

    const result = await Query.listCreditCards(
      null,
      { origin: 'shared' },
      ctx as any
    )

    expect(ctx.clients.commerce.savedCards.listCreditCards).toHaveBeenCalledWith(
      'shared'
    )
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

    const result = await Query.listCreditCards(
      null,
      { origin: 'personal' },
      ctx as any
    )

    expect(ctx.clients.commerce.savedCards.listCreditCards).toHaveBeenCalledWith(
      'personal'
    )
    expect(result).toEqual({ list: [] })
  })

  it('passes through cardLabel when the service has a nickname on file', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.savedCards.listCreditCards.mockResolvedValueOnce([
      { accountId: 'acc-1', cardLabel: 'Team lunch card', origin: 'shared' },
      { accountId: 'acc-2', origin: 'shared' },
    ])

    const result = await Query.listCreditCards(
      null,
      { origin: 'shared' },
      ctx as any
    )

    expect(
      result.list.map((card: { cardLabel?: string }) => card.cardLabel)
    ).toEqual(['Team lunch card', undefined])
  })

  it('asks the client for only the origin the query requested', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.savedCards.listCreditCards.mockResolvedValueOnce([
      { accountId: 'acc-personal', origin: 'personal' },
    ])

    const result = await Query.listCreditCards(
      null,
      { origin: 'personal' },
      ctx as any
    )

    expect(ctx.clients.commerce.savedCards.listCreditCards).toHaveBeenCalledTimes(
      1
    )
    expect(ctx.clients.commerce.savedCards.listCreditCards).toHaveBeenCalledWith(
      'personal'
    )
    expect(result.list.map((card: { origin: string }) => card.origin)).toEqual([
      'personal',
    ])
  })
})
