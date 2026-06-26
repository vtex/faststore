import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Query } from '../../../../../src/platforms/vtex/resolvers/query'

const session = vi.fn()

const makeCtx = () =>
  ({
    account: 'b2bfaststoredev',
    headers: { cookie: 'VtexIdclientAutCookie_b2bfaststoredev=token' },
    clients: {
      commerce: {
        session,
      },
    },
  }) as any

const availableContracts = (Query as any).availableContracts

const sessionContracts = [
  {
    customerId: 'a',
    contractName: 'Corp A',
    isActive: true,
    isCurrent: false,
  },
  {
    customerId: 'b',
    contractName: 'Corp B',
    isActive: true,
    isCurrent: true,
  },
  {
    customerId: 'c',
    contractName: 'Corp C',
    isActive: true,
    isCurrent: false,
  },
]

beforeEach(() => {
  vi.clearAllMocks()
  session.mockResolvedValue({
    namespaces: {
      authentication: { unitId: { value: 'unit-1' } },
      shopper: {
        availableContracts: { value: sessionContracts },
      },
    },
  })
})

describe('Query.availableContracts', () => {
  it('throws when orgUnitId is missing', async () => {
    await expect(
      availableContracts(null, { orgUnitId: '' }, makeCtx())
    ).rejects.toThrow(/orgUnitId/i)
    expect(session).not.toHaveBeenCalled()
  })

  it('forbids listing contracts for a different organization unit', async () => {
    await expect(
      availableContracts(null, { orgUnitId: 'other-unit' }, makeCtx())
    ).rejects.toThrow(/not allowed/i)
    expect(session).toHaveBeenCalledTimes(1)
  })

  it('lists session contracts and flags the current one', async () => {
    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(session).toHaveBeenCalledTimes(1)
    expect(result).toEqual([
      { id: 'a', corporateName: 'Corp A', isActive: false },
      { id: 'b', corporateName: 'Corp B', isActive: true },
      { id: 'c', corporateName: 'Corp C', isActive: false },
    ])
  })

  it('skips contracts without a name or inactive contracts', async () => {
    session.mockResolvedValue({
      namespaces: {
        authentication: { unitId: { value: 'unit-1' } },
        shopper: {
          availableContracts: {
            value: [
              {
                customerId: 'a',
                contractName: 'Corp A',
                isActive: true,
                isCurrent: true,
              },
              {
                customerId: 'b',
                contractName: '',
                isActive: true,
                isCurrent: false,
              },
              {
                customerId: 'c',
                contractName: 'Corp C',
                isActive: false,
                isCurrent: false,
              },
            ],
          },
        },
      },
    })

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toEqual([
      { id: 'a', corporateName: 'Corp A', isActive: true },
    ])
  })

  it('prefers activeContractId over stale isCurrent flags', async () => {
    session.mockResolvedValue({
      namespaces: {
        authentication: {
          unitId: { value: 'unit-1' },
          customerId: { value: 'c' },
        },
        shopper: {
          activeContractId: { value: 'c' },
          availableContracts: {
            value: [
              {
                customerId: 'a',
                contractName: 'Corp A',
                isActive: true,
                isCurrent: true,
              },
              {
                customerId: 'c',
                contractName: 'Corp C',
                isActive: true,
                isCurrent: false,
              },
            ],
          },
        },
      },
    })

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toEqual([
      { id: 'a', corporateName: 'Corp A', isActive: false },
      { id: 'c', corporateName: 'Corp C', isActive: true },
    ])
  })

  it('returns an empty list when the session has no attached contracts', async () => {
    session.mockResolvedValue({
      namespaces: {
        authentication: { unitId: { value: 'unit-1' } },
        shopper: {
          availableContracts: { value: [] },
        },
      },
    })

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toEqual([])
  })

  it('rejects listing when session lookup fails and no unit id is available', async () => {
    session.mockRejectedValueOnce(new Error('session unavailable'))

    await expect(
      availableContracts(null, { orgUnitId: 'unit-1' }, makeCtx())
    ).rejects.toThrow(/not allowed/i)
  })

  it('resolves active contract id from jwt when session omits it', async () => {
    session.mockResolvedValueOnce({
      namespaces: {
        authentication: { unitId: { value: 'unit-1' } },
        shopper: {
          availableContracts: {
            value: [
              {
                customerId: 'jwt-contract',
                contractName: 'JWT Corp',
                isActive: true,
                isCurrent: false,
              },
            ],
          },
        },
      },
    })

    const jwtPayload = Buffer.from(
      JSON.stringify({ unitId: 'unit-1', customerId: 'jwt-contract' })
    ).toString('base64url')
    const token = `header.${jwtPayload}.signature`

    const ctx = makeCtx()
    ctx.headers = {
      cookie: `VtexIdclientAutCookie_b2bfaststoredev=${token}`,
    }

    const result = await availableContracts(null, { orgUnitId: 'unit-1' }, ctx)

    expect(result).toEqual([
      { id: 'jwt-contract', corporateName: 'JWT Corp', isActive: true },
    ])
  })
})
