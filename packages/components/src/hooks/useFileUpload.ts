import { useState, useCallback } from 'react'

export type FileUploadOptions = {
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: Record<string, string[]>
}

const MAX_FILES_DEFAULT = 1
const MAX_SIZE_DEFAULT = 100 * 1024 * 1024 // 100MB
const ACCEPTED_TYPES_DEFAULT = {
  'text/csv': ['.csv'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
}

export const DEFAULT_FILE_UPLOAD_OPTIONS: Required<FileUploadOptions> = {
  maxFiles: MAX_FILES_DEFAULT,
  maxSize: MAX_SIZE_DEFAULT,
  acceptedTypes: ACCEPTED_TYPES_DEFAULT,
}

/**
 * Hook to manage file upload errors and rejections.
 * @param options Configuration options for file upload.
 * @returns An object containing upload error state and handlers.
 */
export function useFileUpload(options = DEFAULT_FILE_UPLOAD_OPTIONS) {
  const [uploadError, setUploadError] = useState<string | null>(null)

  const getErrorMessage = useCallback(
    (code: string, maxSize: number) => {
      switch (code) {
        case 'file-too-large':
          const sizeMB = Math.round(maxSize / (1024 * 1024))
          return `File is too large. Maximum size is ${sizeMB}MB.`

        case 'file-invalid-type':
          return 'Invalid file type. Please upload a CSV, XLS, or XLSX file.'

        case 'too-many-files':
          return `Too many files. Please upload only ${options.maxFiles} file(s).`

        default:
          return 'Failed to upload file. Please try again.'
      }
    },
    [options.maxFiles]
  )

  const onFilesRejected = useCallback(
    (fileRejections: any) => {
      const firstError = fileRejections[0]?.errors[0]

      if (firstError) {
        const errorMessage = getErrorMessage(firstError.code, options.maxSize)
        setUploadError(errorMessage)
      }
    },
    [getErrorMessage, options.maxSize]
  )

  const onClearUploadError = useCallback(() => {
    setUploadError(null)
  }, [])

  return {
    uploadError,
    onFilesRejected,
    onClearUploadError,
  }
}
