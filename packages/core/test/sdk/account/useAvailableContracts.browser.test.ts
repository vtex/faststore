/**
 * @vitest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())
const mockUseQuery = vi.hoisted(() => vi.fn())

vi.mock('@generated', () => ({ gql: (query: unknown) => query }))
vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))
vi.mock('src/sdk/graphql/useQuery', () => ({ useQuery: mockUseQuery }))

import { useAvailableContracts } from '../../../src/sdk/account/useAvailableContracts'

const contracts = [
  { id: 'a', corporateName: 'Corp A', isActive: true },
  { id: 'b', corporateName: 'Corp B', isActive: false },
]

describe('useAvailableContracts', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('skips the query when disabled or orgUnitId is missing', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: '' } })
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isValidating: false,
    })

    const disabled = renderHook(() => useAvailableContracts(false))
    expect(disabled.result.current.contracts).toEqual([])
    expect(disabled.result.current.loading).toBe(false)

    const missingUnit = renderHook(() => useAvailableContracts(true))
    expect(missingUnit.result.current.contracts).toEqual([])
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      { orgUnitId: '' },
      expect.objectContaining({ doNotRun: true })
    )
  })

  it('returns loading while fetching contracts for the current org unit', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isValidating: false,
    })

    const { result } = renderHook(() => useAvailableContracts(true))

    expect(result.current.loading).toBe(true)
    expect(result.current.contracts).toEqual([])
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      { orgUnitId: 'unit-1' },
      expect.objectContaining({ doNotRun: false, dedupingInterval: 0 })
    )
  })

  it('returns contracts when the query succeeds', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })
    mockUseQuery.mockReturnValue({
      data: { availableContracts: contracts },
      error: null,
      isValidating: false,
    })

    const { result } = renderHook(() => useAvailableContracts(true))

    expect(result.current.contracts).toEqual(contracts)
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('returns query errors without loading', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: new Error('boom'),
      isValidating: false,
    })

    const { result } = renderHook(() => useAvailableContracts(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.loading).toBe(false)
  })

  it('keeps loading while the query is validating', () => {
    mockUseSession.mockReturnValue({ b2b: { unitId: 'unit-1' } })
    mockUseQuery.mockReturnValue({
      data: { availableContracts: contracts },
      error: null,
      isValidating: true,
    })

    const { result } = renderHook(() => useAvailableContracts(true))

    expect(result.current.loading).toBe(true)
  })
})
