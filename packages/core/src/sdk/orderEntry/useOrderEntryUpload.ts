import { useCallback, useState } from 'react'

import { gql } from '@generated'
import type {
  UploadFileToOrderEntryMutationMutation,
  UploadFileToOrderEntryMutationMutationVariables,
} from '@generated/graphql'

import { request } from '../graphql/request'

const UploadFileToOrderEntryMutation = gql(`
  mutation UploadFileToOrderEntryMutation($data: IOrderEntryUpload!) {
    uploadFileToOrderEntry(data: $data) {
      objectKey
    }
  }
`)

export type OrderEntryUploadError = {
  message: string
}

export type UseOrderEntryUploadReturn = {
  isUploading: boolean
  error: OrderEntryUploadError | null
  uploadFile: (file: File) => Promise<string | null>
  clearError: () => void
}

/**
 * Reads a File object and returns its content as a Base64-encoded string.
 */
const readFileAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      // Strip the data URL prefix (e.g. "data:text/csv;base64,")
      const base64 = dataUrl.split(',')[1] ?? ''
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })

/**
 * Hook to upload a file to the Order Entry Service via the
 * `uploadFileToOrderEntry` GraphQL mutation (defined in @faststore/api).
 *
 * The file is Base64-encoded client-side and decoded server-side by the
 * resolver, which then forwards the multipart request to the OES with the
 * proper VtexIdclientAutCookie auth header.
 *
 * @returns `{ isUploading, error, uploadFile, clearError }`
 *   - `uploadFile(file)` resolves to the `objectKey` string on success, or `null` on error.
 */
export function useOrderEntryUpload(): UseOrderEntryUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<OrderEntryUploadError | null>(null)

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true)
    setError(null)

    try {
      const fileContent = await readFileAsBase64(file)

      const data = await request<
        UploadFileToOrderEntryMutationMutation,
        UploadFileToOrderEntryMutationMutationVariables
      >(UploadFileToOrderEntryMutation, {
        data: {
          fileContent,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
        },
      })

      return data.uploadFileToOrderEntry?.objectKey ?? null
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload file'

      setError({ message: errorMessage })
      return null
    } finally {
      setIsUploading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { isUploading, error, uploadFile, clearError }
}
