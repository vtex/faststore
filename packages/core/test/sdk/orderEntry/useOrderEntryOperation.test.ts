/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockStartOp = vi.hoisted(() => vi.fn())
const mockUseLazyQuery = vi.hoisted(() =>
  vi.fn(() => [mockStartOp, { isValidating: false, error: null }])
)
const mockUseQuery = vi.hoisted(() => vi.fn(() => ({ data: null, error: null })))

vi.mock('@generated', () => ({ gql: (s: unknown) => s }))
vi.mock('src/sdk/graphql/useLazyQuery', () => ({ useLazyQuery: mockUseLazyQuery }))
vi.mock('src/sdk/graphql/useQuery', () => ({ useQuery: mockUseQuery }))

import { useOrderEntryOperation } from '../../../src/sdk/orderEntry/useOrderEntryOperation'

afterEach(() => {
  vi.clearAllMocks()
})

describe('useOrderEntryOperation', () => {
  it('initializes with null status and not loading', () => {
    mockUseLazyQuery.mockReturnValue([mockStartOp, { isValidating: false, error: null }])
    mockUseQuery.mockReturnValue({ data: null, error: null })

    const { result } = renderHook(() => useOrderEntryOperation())

    expect(result.current.status).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets isLoading (pending) after startOperation resolves with operationId', async () => {
    mockStartOp.mockResolvedValueOnce({
      startOrderEntryOperation: { operationId: 'op-123' },
    })
    mockUseLazyQuery.mockReturnValue([mockStartOp, { isValidating: false, error: null }])
    mockUseQuery.mockReturnValue({ data: null, error: null })

    const { result } = renderHook(() => useOrderEntryOperation())

    await act(async () => {
      await result.current.startOperation({ objectKey: 'key-abc', orderFormId: 'of-1' })
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('isLoading is false and status is set when operation reaches terminal SUCCESS', async () => {
    mockStartOp.mockResolvedValueOnce({
      startOrderEntryOperation: { operationId: 'op-123' },
    })
    mockUseLazyQuery.mockReturnValue([mockStartOp, { isValidating: false, error: null }])
    mockUseQuery.mockReturnValue({
      data: {
        orderEntryOperation: {
          status: 'SUCCESS',
          entityId: 'cart-1',
          message: null,
          missingItems: [],
        },
      },
      error: null,
    })

    const { result } = renderHook(() => useOrderEntryOperation())

    await act(async () => {
      await result.current.startOperation({ objectKey: 'key', orderFormId: 'of-1' })
    })

    expect(result.current.status?.status).toBe('SUCCESS')
    expect(result.current.isLoading).toBe(false)
  })

  it('isLoading is false and status is set when operation reaches FAILED', async () => {
    mockStartOp.mockResolvedValueOnce({
      startOrderEntryOperation: { operationId: 'op-fail' },
    })
    mockUseLazyQuery.mockReturnValue([mockStartOp, { isValidating: false, error: null }])
    mockUseQuery.mockReturnValue({
      data: {
        orderEntryOperation: {
          status: 'FAILED',
          entityId: null,
          message: 'error',
          missingItems: [],
        },
      },
      error: null,
    })

    const { result } = renderHook(() => useOrderEntryOperation())

    await act(async () => {
      await result.current.startOperation({ objectKey: 'key', orderFormId: 'of-1' })
    })

    expect(result.current.status?.status).toBe('FAILED')
    expect(result.current.isLoading).toBe(false)
  })

  it('reset clears operationId and returns to not loading', async () => {
    mockStartOp.mockResolvedValueOnce({
      startOrderEntryOperation: { operationId: 'op-123' },
    })
    mockUseLazyQuery.mockReturnValue([mockStartOp, { isValidating: false, error: null }])
    mockUseQuery.mockReturnValue({ data: null, error: null })

    const { result } = renderHook(() => useOrderEntryOperation())

    await act(async () => {
      await result.current.startOperation({ objectKey: 'key', orderFormId: 'of-1' })
    })

    act(() => result.current.reset())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.status).toBeNull()
  })

  it('does not set operationId when startOperation returns no id', async () => {
    mockStartOp.mockResolvedValueOnce({ startOrderEntryOperation: { operationId: null } })
    mockUseLazyQuery.mockReturnValue([mockStartOp, { isValidating: false, error: null }])
    mockUseQuery.mockReturnValue({ data: null, error: null })

    const { result } = renderHook(() => useOrderEntryOperation())

    await act(async () => {
      await result.current.startOperation({ objectKey: 'key', orderFormId: 'of-1' })
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('returns startError when useLazyQuery exposes an error', () => {
    const error = new Error('Start failed')

    mockUseLazyQuery.mockReturnValue([mockStartOp, { isValidating: false, error }])
    mockUseQuery.mockReturnValue({ data: null, error: null })

    const { result } = renderHook(() => useOrderEntryOperation())

    expect(result.current.error).toBe(error)
  })

  it('returns statusError when useQuery exposes an error', () => {
    const error = new Error('Poll failed')

    mockUseLazyQuery.mockReturnValue([mockStartOp, { isValidating: false, error: null }])
    mockUseQuery.mockReturnValue({ data: null, error })

    const { result } = renderHook(() => useOrderEntryOperation())

    expect(result.current.error).toBe(error)
  })
})
