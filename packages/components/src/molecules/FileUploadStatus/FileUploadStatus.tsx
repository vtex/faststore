import type { HTMLAttributes } from 'react'
import React from 'react'

import { Button, Icon } from '../..'

export type FileUploadState = 'uploading' | 'completed' | 'error'

export type FileUploadErrorType =
  | 'unexpected'
  | 'unsupported'
  | 'unreadable'
  | 'invalid-structure'
  | 'empty'
  | 'too-large'

export interface FileUploadStatusProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The file being uploaded.
   */
  file: File
  /**
   * Current upload state.
   * @default 'uploading'
   */
  state?: FileUploadState
  /**
   * Type of error when state is 'error'.
   */
  errorType?: FileUploadErrorType
  /**
   * Custom error message. If provided, overrides the default error message for the errorType.
   */
  errorMessage?: string
  /**
   * Callback when the remove/cancel button is clicked.
   */
  onRemove?: () => void
  /**
   * Callback when the search button is clicked (only shown when state is 'completed').
   */
  onSearch?: () => void
  /**
   * Callback when download template is clicked (only shown when state is 'error').
   */
  onDownloadTemplate?: () => void
  /**
   * Callback when select file is clicked (only shown when state is 'error').
   */
  onSelectFile?: () => void
}

const FileUploadStatus = ({
  testId = 'fs-file-upload-status',
  file,
  state = 'uploading',
  errorType,
  errorMessage,
  onRemove,
  onSearch,
  onDownloadTemplate,
  onSelectFile,
  ...otherProps
}: FileUploadStatusProps) => {
  const formatFileSize = (bytes: number): string => {
    return `${(bytes / 1024).toFixed(0)} KB` //ADJUST ONCE INTEGRATED
  }

  const getErrorMessage = (): { title: string; description: string } => {
    if (errorMessage) {
      // If custom error message is provided, use it as title and empty description
      return { title: errorMessage, description: '' }
    }

    switch (errorType) {
      case 'unsupported':
        return {
          title: 'Unsupported file type.',
          description: 'Upload a CSV or use the template provided.',
        }
      case 'unreadable':
        return {
          title: "File can't be read.",
          description: "Make sure it's correctly formatted and not corrupted.",
        }
      case 'invalid-structure':
        return {
          title: 'Invalid structure.',
          description: 'Check missing headers or columns and try again.',
        }
      case 'empty':
        return {
          title: 'File is empty.',
          description: 'Add items to your file and upload it again.',
        }
      case 'too-large':
        return {
          title: 'File too large.',
          description: 'Split it into smaller files and try again.',
        }
      case 'unexpected':
        return {
          title: 'Upload failed.',
          description:
            'An unexpected error occurred. Try again or upload a new file.',
        }
      default:
        return {
          title: 'Upload failed.',
          description:
            'An unexpected error occurred. Try again or upload a new file.',
        }
    }
  }

  const getStatusText = (): string => {
    switch (state) {
      case 'uploading':
        return 'Uploading your file...'
      case 'completed':
        return `Completed • ${formatFileSize(file.size)}`
      default:
        return ''
    }
  }

  const getIcon = () => {
    switch (state) {
      case 'uploading':
        return (
          <div data-fs-file-upload-status-icon-loading>
            <Icon name="CircleNotch" width={24} height={24} strokeWidth={5} />
          </div>
        )
      case 'completed':
        return (
          <div data-fs-file-upload-status-icon-completed>
            <Icon name="Table" width={24} height={24} strokeWidth={5} />
          </div>
        )
      case 'error':
        return (
          <div data-fs-file-upload-status-icon-error>
            <Icon
              name="WarningOctagon"
              width={24}
              height={24}
              strokeWidth={5}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      data-fs-file-upload-status
      data-fs-file-upload-status-state={state}
      data-testid={testId}
      {...otherProps}
    >
      <div
        data-fs-file-upload-status-file-info
        data-fs-file-upload-state={state}
      >
        <div data-fs-file-upload-status-icon>{getIcon()}</div>

        <div data-fs-file-upload-status-details>
          {state === 'error' ? (
            <>
              <p data-fs-file-upload-status-text-error>
                {getErrorMessage().title}
              </p>
              <p data-fs-file-upload-status-text-error>
                {getErrorMessage().description}
              </p>
            </>
          ) : (
            <>
              <p data-fs-file-upload-status-filename>{file.name}</p>
              <p data-fs-file-upload-status-text>{getStatusText()}</p>
            </>
          )}
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            data-fs-file-upload-status-remove
            aria-label="Remove file"
          >
            <Icon name="X" width={16} height={16} />
          </button>
        )}
      </div>
      {state === 'completed' && onSearch && (
        <Button
          variant="primary"
          size="regular"
          onClick={onSearch}
          data-fs-file-upload-status-search-button
        >
          Search
        </Button>
      )}

      {state === 'error' && (
        <div data-fs-file-upload-status-error-actions>
          {onDownloadTemplate && (
            <Button
              variant="secondary"
              size="regular"
              onClick={onDownloadTemplate}
              data-fs-file-upload-status-download-button
            >
              Download template
            </Button>
          )}
          {onSelectFile && (
            <Button
              variant="primary"
              size="regular"
              onClick={onSelectFile}
              data-fs-file-upload-status-select-button
            >
              Select file
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default FileUploadStatus
