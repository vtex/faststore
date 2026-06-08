import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Query } from '../../../../../src/platforms/vtex/resolvers/query'

const getScopesByOrgUnit = vi.fn()
const getContractById = vi.fn()
const session = vi.fn()

const makeCtx = () =>
  ({
    clients: {
      commerce: {
        units: { getScopesByOrgUnit },
        masterData: { getContractById },
        session,
      },
    },
  }) as any

const availableContracts = (Query as any).availableContracts

beforeEach(() => {
  vi.clearAllMocks()
  // Default: active contract id resolves to "b" via the session profile id.
  session.mockResolvedValue({
    namespaces: { profile: { id: { value: 'b' } } },
  })
})

describe('Query.availableContracts', () => {
  it('throws when orgUnitId is missing', async () => {
    await expect(
      availableContracts(null, { orgUnitId: '' }, makeCtx())
    ).rejects.toThrow(/orgUnitId/i)
    expect(getScopesByOrgUnit).not.toHaveBeenCalled()
  })

  it('lists the Org Unit contracts by corporate name and flags the active one', async () => {
    getScopesByOrgUnit.mockResolvedValue({
      organizationUnitId: 'unit-1',
      scopes: [{ scope: 'contract', ids: ['a', 'b', 'c'] }],
    })
    getContractById.mockImplementation(
      ({ contractId }: { contractId: string }) =>
        Promise.resolve({ corporateName: `Corp ${contractId.toUpperCase()}` })
    )

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(getScopesByOrgUnit).toHaveBeenCalledWith({ orgUnitId: 'unit-1' })
    // Governance + name resolution: corporate names, never raw IDs.
    expect(result).toEqual([
      { id: 'a', corporateName: 'Corp A', isActive: false },
      { id: 'b', corporateName: 'Corp B', isActive: true },
      { id: 'c', corporateName: 'Corp C', isActive: false },
    ])
  })

  it('returns an empty list when the Org Unit has no contracts', async () => {
    getScopesByOrgUnit.mockResolvedValue({
      organizationUnitId: 'unit-1',
      scopes: [],
    })

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toEqual([])
    expect(getContractById).not.toHaveBeenCalled()
  })

  it('isolates per-contract resolution failures', async () => {
    getScopesByOrgUnit.mockResolvedValue({
      organizationUnitId: 'unit-1',
      scopes: [{ scope: 'contract', ids: ['a', 'b'] }],
    })
    getContractById.mockImplementation(
      ({ contractId }: { contractId: string }) =>
        contractId === 'a'
          ? Promise.reject(new Error('MasterData down'))
          : Promise.resolve({ corporateName: 'Corp B' })
    )

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toEqual([
      { id: 'b', corporateName: 'Corp B', isActive: true },
    ])
  })

  it('skips contracts that have no corporate name', async () => {
    getScopesByOrgUnit.mockResolvedValue({
      organizationUnitId: 'unit-1',
      scopes: [{ scope: 'contract', ids: ['a', 'b'] }],
    })
    getContractById.mockImplementation(
      ({ contractId }: { contractId: string }) =>
        contractId === 'a'
          ? Promise.resolve({ corporateName: '' })
          : Promise.resolve({ corporateName: 'Corp B' })
    )

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toEqual([
      { id: 'b', corporateName: 'Corp B', isActive: true },
    ])
  })

  it('deduplicates contract ids across scopes', async () => {
    getScopesByOrgUnit.mockResolvedValue({
      organizationUnitId: 'unit-1',
      scopes: [
        { scope: 'contract', ids: ['a', 'b'] },
        { scope: 'price', ids: ['b'] },
      ],
    })
    getContractById.mockImplementation(
      ({ contractId }: { contractId: string }) =>
        Promise.resolve({ corporateName: `Corp ${contractId.toUpperCase()}` })
    )

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toHaveLength(2)
    expect(getContractById).toHaveBeenCalledTimes(2)
  })
})
