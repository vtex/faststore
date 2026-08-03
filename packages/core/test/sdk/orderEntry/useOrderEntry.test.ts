/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockUploadFile = vi.hoisted(() => vi.fn())
const mockStartOperation = vi.hoisted(() => vi.fn())
const mockReset = vi.hoisted(() => vi.fn())
const mockClearError = vi.hoisted(() => vi.fn())

const uploadState = vi.hoisted(() => ({
  isUploading: false,
  error: null as { message: string } | null,
}))

const operationState = vi.hoisted(() => ({
  isLoading: false,
  error: null as Error | null,
  status: null as unknown,
}))

vi.mock('src/sdk/cart', () => ({
  useCart: vi.fn(() => ({ id: 'cart-123' })),
}))

vi.mock('../../../src/sdk/orderEntry/useOrderEntryUpload', () => ({
  useOrderEntryUpload: vi.fn(() => ({
    uploadFile: mockUploadFile,
    isUploading: uploadState.isUploading,
    error: uploadState.error,
    clearError: mockClearError,
  })),
}))

vi.mock('../../../src/sdk/orderEntry/useOrderEntryOperation', () => ({
  useOrderEntryOperation: vi.fn(() => ({
    startOperation: mockStartOperation,
    status: operationState.status,
    isLoading: operationState.isLoading,
    error: operationState.error,
    reset: mockReset,
  })),
}))

import { useOrderEntry } from '../../../src/sdk/orderEntry/useOrderEntry'

afterEach(() => {
  vi.clearAllMocks()
  uploadState.isUploading = false
  uploadState.error = null
  operationState.isLoading = false
  operationState.error = null
  operationState.status = null
})

describe('useOrderEntry', () => {
  it('initializes with isLoading=false and no error', () => {
    const { result } = renderHook(() => useOrderEntry())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.status).toBeNull()
  })

  it('submitFile calls uploadFile then startOperation with cartId', async () => {
    mockUploadFile.mockResolvedValueOnce('s3-key-abc')
    mockStartOperation.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useOrderEntry())
    const file = new File(['data'], 'items.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.submitFile(file)
    })

    expect(mockUploadFile).toHaveBeenCalledWith(file)
    expect(mockStartOperation).toHaveBeenCalledWith({
      objectKey: 's3-key-abc',
      orderFormId: 'cart-123',
    })
  })

  it('submitFile stops when uploadFile returns null', async () => {
    mockUploadFile.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useOrderEntry())
    const file = new File(['data'], 'items.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.submitFile(file)
    })

    expect(mockStartOperation).not.toHaveBeenCalled()
  })

  it('exposes reset from useOrderEntryOperation', () => {
    const { result } = renderHook(() => useOrderEntry())

    result.current.reset()

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('isUploading reflects upload state', () => {
    uploadState.isUploading = true

    const { result } = renderHook(() => useOrderEntry())

    expect(result.current.isUploading).toBe(true)
    expect(result.current.isLoading).toBe(true)
  })

  it('exposes upload error as Error when upload fails', () => {
    uploadState.error = { message: 'Upload failed' }

    const { result } = renderHook(() => useOrderEntry())

    expect(result.current.error?.message).toBe('Upload failed')
  })

  it('exposes operation error when operation fails', () => {
    operationState.error = new Error('Operation failed')

    const { result } = renderHook(() => useOrderEntry())

    expect(result.current.error?.message).toBe('Operation failed')
  })

  it('isProcessing reflects operation loading state', () => {
    operationState.isLoading = true

    const { result } = renderHook(() => useOrderEntry())

    expect(result.current.isProcessing).toBe(true)
    expect(result.current.isLoading).toBe(true)
  })
})
