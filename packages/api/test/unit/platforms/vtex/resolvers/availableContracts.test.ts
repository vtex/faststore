import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Query } from '../../../../../src/platforms/vtex/resolvers/query'

const getAttachedContractsByOrgUnit = vi.fn()
const session = vi.fn()

const makeCtx = () =>
  ({
    account: 'b2bfaststoredev',
    headers: { cookie: 'VtexIdclientAutCookie_b2bfaststoredev=token' },
    clients: {
      commerce: {
        storeFront: { getAttachedContractsByOrgUnit },
        session,
      },
    },
  }) as any

const availableContracts = (Query as any).availableContracts

beforeEach(() => {
  vi.clearAllMocks()
  session.mockResolvedValue({
    namespaces: {
      authentication: { unitId: { value: 'unit-1' } },
      profile: { id: { value: 'b' } },
    },
  })
})

describe('Query.availableContracts', () => {
  it('throws when orgUnitId is missing', async () => {
    await expect(
      availableContracts(null, { orgUnitId: '' }, makeCtx())
    ).rejects.toThrow(/orgUnitId/i)
    expect(getAttachedContractsByOrgUnit).not.toHaveBeenCalled()
  })

  it('forbids listing contracts for a different organization unit', async () => {
    await expect(
      availableContracts(null, { orgUnitId: 'other-unit' }, makeCtx())
    ).rejects.toThrow(/not allowed/i)
    expect(getAttachedContractsByOrgUnit).not.toHaveBeenCalled()
  })

  it('lists attached unit contracts and flags the active one', async () => {
    getAttachedContractsByOrgUnit.mockResolvedValue({
      ids: ['a', 'b', 'c'],
      contracts: [
        { id: 'a', name: 'Corp A', email: 'a@example.com' },
        { id: 'b', name: 'Corp B', email: 'b@example.com' },
        { id: 'c', name: 'Corp C', email: 'c@example.com' },
      ],
      total: 3,
    })

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(getAttachedContractsByOrgUnit).toHaveBeenCalledWith({
      orgUnitId: 'unit-1',
    })
    expect(result).toEqual([
      { id: 'a', corporateName: 'Corp A', isActive: false },
      { id: 'b', corporateName: 'Corp B', isActive: true },
      { id: 'c', corporateName: 'Corp C', isActive: false },
    ])
  })

  it('skips contracts without name or email', async () => {
    getAttachedContractsByOrgUnit.mockResolvedValue({
      ids: ['a', 'b'],
      contracts: [
        { id: 'a', name: 'Corp A', email: 'a@example.com' },
        { id: 'b', name: '', email: 'b@example.com' },
      ],
      total: 2,
    })

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toEqual([
      { id: 'a', corporateName: 'Corp A', isActive: false },
    ])
  })

  it('returns an empty list when the unit has no attached contracts', async () => {
    getAttachedContractsByOrgUnit.mockResolvedValue({
      ids: [],
      contracts: [],
      total: 0,
    })

    const result = await availableContracts(
      null,
      { orgUnitId: 'unit-1' },
      makeCtx()
    )

    expect(result).toEqual([])
  })
})
