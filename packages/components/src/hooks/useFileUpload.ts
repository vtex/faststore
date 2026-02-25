import { useCallback, useState } from 'react'
import type { FileRejection } from 'react-dropzone/.'

/**
 * Error codes returned by react-dropzone when a file is rejected.
 */
export enum FileRejectionCode {
  FileTooLarge = 'file-too-large',
  FileInvalidType = 'file-invalid-type',
  TooManyFiles = 'too-many-files',
}

export type FileUploadOptions = {
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: Record<string, string[]>
}

const MAX_FILES_DEFAULT = 1
const MAX_SIZE_DEFAULT = 100 * 1024 * 1024 // 100MB
const ACCEPTED_TYPES_DEFAULT = {
  'text/csv': ['.csv'],
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
export function useFileUpload(options: FileUploadOptions = {}) {
  const resolvedOptions = { ...DEFAULT_FILE_UPLOAD_OPTIONS, ...options }
  const { maxFiles, maxSize, acceptedTypes } = resolvedOptions
  const allowedExtensions = Object.values(acceptedTypes)
    .flat()
    .map((ext) => ext.replace('.', '').toUpperCase())
    .join(', ')

  const [uploadError, setUploadError] = useState<string | null>(null)

  const getErrorMessage = useCallback(
    (code: string) => {
      switch (code) {
        case FileRejectionCode.FileTooLarge: {
          const sizeMB = Math.round(maxSize / (1024 * 1024))
          return `File is too large. Maximum size is ${sizeMB}MB.`
        }

        case FileRejectionCode.FileInvalidType:
          return `Invalid file type. Please upload a ${allowedExtensions} file.`

        case FileRejectionCode.TooManyFiles:
          return `Too many files. Please upload only ${maxFiles} file(s).`

        default:
          return 'Failed to upload file. Please try again.'
      }
    },
    [maxFiles, maxSize, allowedExtensions]
  )

  const onFilesRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      const firstError = fileRejections[0]?.errors[0]

      if (firstError) {
        const errorMessage = getErrorMessage(firstError.code)
        setUploadError(errorMessage)
      }
    },
    [getErrorMessage]
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
