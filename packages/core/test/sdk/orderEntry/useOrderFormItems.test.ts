/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockUseQuery = vi.hoisted(() => vi.fn())
vi.mock('@generated', () => ({ gql: (s: unknown) => s }))
vi.mock('src/sdk/graphql/useQuery', () => ({ useQuery: mockUseQuery }))

import { useOrderFormItems } from '../../../src/sdk/orderEntry/useOrderFormItems'

afterEach(() => {
  vi.clearAllMocks()
})

describe('useOrderFormItems', () => {
  it('initializes with null items and not loading', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      error: null,
      isValidating: false,
    })

    const { result } = renderHook(() => useOrderFormItems())

    expect(result.current.items).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('returns items when query resolves', () => {
    const mockItems = [
      {
        id: 'sku-1',
        name: 'Product A',
        price: 100,
        listPrice: 120,
        quantity: 2,
        imageUrl: null,
        availability: 'available',
        seller: '1',
        unitMultiplier: 1,
      },
    ]

    mockUseQuery.mockReturnValue({
      data: { orderFormItems: mockItems },
      error: null,
      isValidating: false,
    })

    const { result } = renderHook(() => useOrderFormItems())

    act(() => {
      result.current.fetchOrderFormItems('of-123')
    })

    expect(result.current.items).toEqual(mockItems)
  })

  it('isLoading is true when orderFormId is set but data and error are null', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      error: null,
      isValidating: false,
    })

    const { result } = renderHook(() => useOrderFormItems())

    act(() => {
      result.current.fetchOrderFormItems('of-123')
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('isLoading is false when error is present', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      error: new Error('fetch failed'),
      isValidating: false,
    })

    const { result } = renderHook(() => useOrderFormItems())

    act(() => {
      result.current.fetchOrderFormItems('of-123')
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('reset clears orderFormId and stops loading', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      error: null,
      isValidating: false,
    })

    const { result } = renderHook(() => useOrderFormItems())

    act(() => result.current.fetchOrderFormItems('of-123'))
    act(() => result.current.reset())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.items).toBeNull()
  })

  it('exposes error from useQuery', () => {
    const error = new Error('Network error')

    mockUseQuery.mockReturnValue({ data: null, error, isValidating: false })

    const { result } = renderHook(() => useOrderFormItems())

    expect(result.current.error).toBe(error)
  })

  it('exposes isValidating from useQuery', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      error: null,
      isValidating: true,
    })

    const { result } = renderHook(() => useOrderFormItems())

    expect(result.current.isValidating).toBe(true)
  })
})
