import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { FileRejectionCode, useFileUpload } from '../../src/hooks/useFileUpload'

afterEach(() => {})

const makeRejection = (code: string) => ({
  file: new File([''], 'test.csv'),
  errors: [{ code, message: '' }],
})

describe('useFileUpload', () => {
  it('initializes with null uploadError', () => {
    const { result } = renderHook(() => useFileUpload())
    expect(result.current.uploadError).toBeNull()
  })

  it('sets error on FileTooLarge rejection using maxSize', () => {
    const { result } = renderHook(() =>
      useFileUpload({ maxSize: 10 * 1024 * 1024 })
    )

    act(() => {
      result.current.onFilesRejected([
        makeRejection(FileRejectionCode.FileTooLarge),
      ])
    })

    expect(result.current.uploadError).toBe(
      'File is too large. Maximum size is 10MB.'
    )
  })

  it('sets error on FileInvalidType rejection', () => {
    const { result } = renderHook(() =>
      useFileUpload({ acceptedTypes: { 'text/csv': ['.csv'] } })
    )

    act(() => {
      result.current.onFilesRejected([
        makeRejection(FileRejectionCode.FileInvalidType),
      ])
    })

    expect(result.current.uploadError).toBe(
      'Invalid file type. Please upload a CSV file.'
    )
  })

  it('sets error on TooManyFiles rejection using maxFiles', () => {
    const { result } = renderHook(() => useFileUpload({ maxFiles: 1 }))

    act(() => {
      result.current.onFilesRejected([
        makeRejection(FileRejectionCode.TooManyFiles),
      ])
    })

    expect(result.current.uploadError).toBe(
      'Too many files. Please upload only 1 file(s).'
    )
  })

  it('sets default error for unknown rejection code', () => {
    const { result } = renderHook(() => useFileUpload())

    act(() => {
      result.current.onFilesRejected([makeRejection('unknown-code')])
    })

    expect(result.current.uploadError).toBe(
      'Failed to upload file. Please try again.'
    )
  })

  it('uses first rejection when multiple are provided', () => {
    const { result } = renderHook(() => useFileUpload())

    act(() => {
      result.current.onFilesRejected([
        makeRejection(FileRejectionCode.TooManyFiles),
        makeRejection(FileRejectionCode.FileTooLarge),
      ])
    })

    expect(result.current.uploadError).toContain('Too many files')
  })

  it('does not set error when fileRejections is empty', () => {
    const { result } = renderHook(() => useFileUpload())

    act(() => {
      result.current.onFilesRejected([])
    })

    expect(result.current.uploadError).toBeNull()
  })

  it('clears uploadError when onClearUploadError is called', () => {
    const { result } = renderHook(() => useFileUpload())

    act(() => {
      result.current.onFilesRejected([
        makeRejection(FileRejectionCode.TooManyFiles),
      ])
    })

    expect(result.current.uploadError).not.toBeNull()

    act(() => {
      result.current.onClearUploadError()
    })

    expect(result.current.uploadError).toBeNull()
  })

  it('uses default maxSize of 100MB in error message', () => {
    const { result } = renderHook(() => useFileUpload())

    act(() => {
      result.current.onFilesRejected([
        makeRejection(FileRejectionCode.FileTooLarge),
      ])
    })

    expect(result.current.uploadError).toBe(
      'File is too large. Maximum size is 100MB.'
    )
  })

  it('formats multiple accepted extensions in error message', () => {
    const { result } = renderHook(() =>
      useFileUpload({
        acceptedTypes: {
          'text/csv': ['.csv'],
          'application/vnd.ms-excel': ['.xlsx'],
        },
      })
    )

    act(() => {
      result.current.onFilesRejected([
        makeRejection(FileRejectionCode.FileInvalidType),
      ])
    })

    expect(result.current.uploadError).toContain('CSV')
    expect(result.current.uploadError).toContain('XLSX')
  })
})
