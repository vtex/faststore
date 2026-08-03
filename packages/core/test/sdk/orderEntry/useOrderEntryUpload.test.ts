/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockRequest = vi.hoisted(() => vi.fn())
vi.mock('@generated', () => ({ gql: (s: unknown) => s }))
vi.mock('src/sdk/graphql/request', () => ({ request: mockRequest }))

import { useOrderEntryUpload } from '../../../src/sdk/orderEntry/useOrderEntryUpload'

afterEach(() => {
  vi.clearAllMocks()
})

describe('useOrderEntryUpload', () => {
  it('initializes with isUploading=false and no error', () => {
    const { result } = renderHook(() => useOrderEntryUpload())

    expect(result.current.isUploading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('returns objectKey on success and resets isUploading', async () => {
    mockRequest.mockResolvedValueOnce({
      uploadFileToOrderEntry: { objectKey: 's3-key-abc' },
    })

    const { result } = renderHook(() => useOrderEntryUpload())
    const file = new File(['SKU,Qty'], 'items.csv', { type: 'text/csv' })

    let objectKey: string | null = null

    await act(async () => {
      objectKey = await result.current.uploadFile(file)
    })

    expect(objectKey).toBe('s3-key-abc')
    expect(result.current.isUploading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets error on request failure and returns null', async () => {
    mockRequest.mockRejectedValueOnce(new Error('Upload failed'))

    const { result } = renderHook(() => useOrderEntryUpload())
    const file = new File(['data'], 'items.csv', { type: 'text/csv' })

    let objectKey: string | null = null

    await act(async () => {
      objectKey = await result.current.uploadFile(file)
    })

    expect(objectKey).toBeNull()
    expect(result.current.error).toEqual({ message: 'Upload failed' })
    expect(result.current.isUploading).toBe(false)
  })

  it('sets generic error message for non-Error throws', async () => {
    mockRequest.mockRejectedValueOnce('string error')

    const { result } = renderHook(() => useOrderEntryUpload())
    const file = new File(['data'], 'items.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFile(file)
    })

    expect(result.current.error).toEqual({ message: 'Failed to upload file' })
  })

  it('clears error when clearError is called', async () => {
    mockRequest.mockRejectedValueOnce(new Error('error'))

    const { result } = renderHook(() => useOrderEntryUpload())
    const file = new File(['data'], 'items.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFile(file)
    })

    act(() => result.current.clearError())

    expect(result.current.error).toBeNull()
  })

  it('returns null when objectKey is absent in response', async () => {
    mockRequest.mockResolvedValueOnce({
      uploadFileToOrderEntry: { objectKey: null },
    })

    const { result } = renderHook(() => useOrderEntryUpload())
    const file = new File(['data'], 'items.csv', { type: 'text/csv' })

    let objectKey: string | null = null

    await act(async () => {
      objectKey = await result.current.uploadFile(file)
    })

    expect(objectKey).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('passes file name and mimeType to request', async () => {
    mockRequest.mockResolvedValueOnce({
      uploadFileToOrderEntry: { objectKey: 'key' },
    })

    const { result } = renderHook(() => useOrderEntryUpload())
    const file = new File(['data'], 'items.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFile(file)
    })

    const callArg = mockRequest.mock.calls[0][1]

    expect(callArg.data.fileName).toBe('items.csv')
    expect(callArg.data.mimeType).toBe('text/csv')
  })

  it('uses application/octet-stream when file has no type', async () => {
    mockRequest.mockResolvedValueOnce({
      uploadFileToOrderEntry: { objectKey: 'key' },
    })

    const { result } = renderHook(() => useOrderEntryUpload())
    const file = new File(['data'], 'noext')

    await act(async () => {
      await result.current.uploadFile(file)
    })

    const callArg = mockRequest.mock.calls[0][1]

    expect(callArg.data.mimeType).toBe('application/octet-stream')
  })
})
