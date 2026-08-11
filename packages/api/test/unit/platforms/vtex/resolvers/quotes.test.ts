import { describe, expect, it, vi } from 'vitest'

import { Query } from '../../../../../src/platforms/vtex/resolvers/query'

const makeContext = (overrides: Record<string, unknown> = {}) => ({
  clients: {
    commerce: {
      quotes: {
        listUserQuotes: vi.fn(),
      },
      masterData: {
        getShopperById: vi.fn(),
      },
      session: vi.fn(),
    },
  },
  ...overrides,
})

describe('Query.listUserQuotes', () => {
  it('maps quotes and resolves paging from the client result', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.quotes.listUserQuotes.mockResolvedValueOnce({
      items: [
        {
          id: 'q-1',
          status: 'Draft',
          label: 'My quote',
          createdAt: '2026-01-01T00:00:00Z',
          expiresAt: '2026-02-01T00:00:00Z',
          amount: 100,
          createdBy: null,
        },
      ],
      totalItems: 1,
      pageNumber: 1,
      pageSize: 25,
    })

    const result = await Query.listUserQuotes(null, {}, ctx as any)

    expect(result).toEqual({
      list: [
        {
          id: 'q-1',
          status: 'Draft',
          label: 'My quote',
          createdAt: '2026-01-01T00:00:00Z',
          expiresAt: '2026-02-01T00:00:00Z',
          amount: 100,
          createdBy: null,
        },
      ],
      paging: { total: 1, currentPage: 1, perPage: 25 },
    })
    expect(
      ctx.clients.commerce.masterData.getShopperById
    ).not.toHaveBeenCalled()
  })

  it('falls back to null label when the client omits it', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.quotes.listUserQuotes.mockResolvedValueOnce({
      items: [
        {
          id: 'q-1',
          status: 'Draft',
          createdAt: '2026-01-01T00:00:00Z',
          expiresAt: '2026-02-01T00:00:00Z',
          amount: 100,
        },
      ],
      totalItems: 1,
      pageNumber: 1,
      pageSize: 25,
    })

    const result = await Query.listUserQuotes(null, {}, ctx as any)

    expect(result.list[0].label).toBeNull()
    expect(result.list[0].createdBy).toBeNull()
  })

  it('resolves createdBy to the shopper full name once per unique id (dedupe)', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.quotes.listUserQuotes.mockResolvedValueOnce({
      items: [
        {
          id: 'q-1',
          status: 'Draft',
          createdAt: '2026-01-01T00:00:00Z',
          expiresAt: '2026-02-01T00:00:00Z',
          amount: 100,
          createdBy: 'user-1',
        },
        {
          id: 'q-2',
          status: 'Requested',
          createdAt: '2026-01-02T00:00:00Z',
          expiresAt: '2026-02-02T00:00:00Z',
          amount: 200,
          createdBy: 'user-1',
        },
        {
          id: 'q-3',
          status: 'Approved',
          createdAt: '2026-01-03T00:00:00Z',
          expiresAt: '2026-02-03T00:00:00Z',
          amount: 300,
          createdBy: 'user-2',
        },
      ],
      totalItems: 3,
      pageNumber: 1,
      pageSize: 25,
    })
    ctx.clients.commerce.masterData.getShopperById.mockImplementation(
      ({ userId }: { userId: string }) =>
        Promise.resolve(
          userId === 'user-1'
            ? [{ firstName: 'Ada', lastName: 'Lovelace' }]
            : [{ firstName: 'Alan', lastName: 'Turing' }]
        )
    )

    const result = await Query.listUserQuotes(null, {}, ctx as any)

    expect(
      ctx.clients.commerce.masterData.getShopperById
    ).toHaveBeenCalledTimes(2)
    expect(result.list[0].createdBy).toBe('Ada Lovelace')
    expect(result.list[1].createdBy).toBe('Ada Lovelace')
    expect(result.list[2].createdBy).toBe('Alan Turing')
  })

  it('falls back to the raw createdBy id when the shopper lookup fails', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.quotes.listUserQuotes.mockResolvedValueOnce({
      items: [
        {
          id: 'q-1',
          status: 'Draft',
          createdAt: '2026-01-01T00:00:00Z',
          expiresAt: '2026-02-01T00:00:00Z',
          amount: 100,
          createdBy: 'user-1',
        },
      ],
      totalItems: 1,
      pageNumber: 1,
      pageSize: 25,
    })
    ctx.clients.commerce.masterData.getShopperById.mockRejectedValueOnce(
      new Error('boom')
    )

    const result = await Query.listUserQuotes(null, {}, ctx as any)

    expect(result.list[0].createdBy).toBe('user-1')
  })

  it('falls back to the raw createdBy id when the shopper has no name', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.quotes.listUserQuotes.mockResolvedValueOnce({
      items: [
        {
          id: 'q-1',
          status: 'Draft',
          createdAt: '2026-01-01T00:00:00Z',
          expiresAt: '2026-02-01T00:00:00Z',
          amount: 100,
          createdBy: 'user-1',
        },
      ],
      totalItems: 1,
      pageNumber: 1,
      pageSize: 25,
    })
    ctx.clients.commerce.masterData.getShopperById.mockResolvedValueOnce([])

    const result = await Query.listUserQuotes(null, {}, ctx as any)

    expect(result.list[0].createdBy).toBe('user-1')
  })
})

describe('Query.isOrganizationMember', () => {
  it('returns true when the session has a unitId', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.session.mockResolvedValueOnce({
      namespaces: { authentication: { unitId: { value: 'unit-1' } } },
    })

    const result = await Query.isOrganizationMember(null, null, ctx as any)

    expect(result).toBe(true)
  })

  it('returns false when the session has no unitId', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.session.mockResolvedValueOnce({
      namespaces: { authentication: { unitId: { value: '' } } },
    })

    const result = await Query.isOrganizationMember(null, null, ctx as any)

    expect(result).toBe(false)
  })

  it('returns false when the session call fails', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.session.mockRejectedValueOnce(new Error('boom'))

    const result = await Query.isOrganizationMember(null, null, ctx as any)

    expect(result).toBe(false)
  })

  it('returns false when authentication namespace is missing', async () => {
    const ctx = makeContext()
    ctx.clients.commerce.session.mockResolvedValueOnce({ namespaces: {} })

    const result = await Query.isOrganizationMember(null, null, ctx as any)

    expect(result).toBe(false)
  })
})
