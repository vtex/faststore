import type { HTMLAttributes } from 'react'
import React from 'react'

import { Button, Icon } from '../..'

export enum FileUploadState {
  Uploading = 'uploading',
  Completed = 'completed',
  Error = 'error',
}

export enum FileUploadErrorType {
  Unexpected = 'unexpected',
  Unsupported = 'unsupported',
  Unreadable = 'unreadable',
  InvalidStructure = 'invalid-structure',
  Empty = 'empty',
  TooLarge = 'too-large',
}

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
  /**
   * Aria-label for the remove button (e.g. from CMS).
   */
  removeButtonAriaLabel: string
  /**
   * Label for the search button when state is 'completed' (e.g. from CMS).
   */
  searchButtonLabel: string
  /**
   * Label for the download template button (e.g. from CMS).
   */
  downloadTemplateButtonLabel: string
  /**
   * Label for the select file button (e.g. from CMS).
   */
  selectFileButtonLabel: string
  /**
   * Error messages per error type (e.g. from CMS). Required when state is Error to show messages.
   */
  errorMessages: Partial<
    Record<FileUploadErrorType, { title: string; description: string }>
  >
  /**
   * Status text when state is Uploading (e.g. from CMS).
   */
  uploadingStatusText: string
  /**
   * Status text when state is Completed (e.g. from CMS). May include file size.
   */
  completedStatusText: string
  /**
   * Custom file name display (optional).
   */
  fileName?: string
}

const FileUploadStatus = ({
  testId = 'fs-file-upload-status',
  file,
  state = FileUploadState.Uploading,
  errorType,
  errorMessage,
  onRemove,
  onSearch,
  onDownloadTemplate,
  onSelectFile,
  removeButtonAriaLabel,
  searchButtonLabel,
  downloadTemplateButtonLabel,
  selectFileButtonLabel,
  errorMessages,
  uploadingStatusText,
  completedStatusText,
  fileName,
  ...otherProps
}: FileUploadStatusProps) => {
  const getErrorMessage = (): { title: string; description: string } => {
    if (errorMessage) {
      return { title: errorMessage, description: '' }
    }
    if (errorType && errorMessages?.[errorType]) {
      return errorMessages[errorType]!
    }
    return { title: '', description: '' }
  }

  const getStatusText = (): string => {
    switch (state) {
      case FileUploadState.Uploading:
        return uploadingStatusText
      case FileUploadState.Completed:
        return completedStatusText
      default:
        return ''
    }
  }

  const getIcon = () => {
    switch (state) {
      case FileUploadState.Uploading:
        return (
          <div data-fs-file-upload-status-icon-loading>
            <Icon name="CircleNotch" width={24} height={24} strokeWidth={5} />
          </div>
        )
      case FileUploadState.Completed:
        return (
          <div data-fs-file-upload-status-icon-completed>
            <Icon name="Table" width={24} height={24} strokeWidth={5} />
          </div>
        )
      case FileUploadState.Error:
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
          {state === FileUploadState.Error ? (
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
              <p data-fs-file-upload-status-filename>{fileName ?? file.name}</p>
              <p data-fs-file-upload-status-text>{getStatusText()}</p>
            </>
          )}
        </div>

        {onRemove && (
          <Button
            type="button"
            onClick={onRemove}
            data-fs-file-upload-status-remove
            aria-label={removeButtonAriaLabel}
          >
            <Icon name="X" width={16} height={16} />
          </Button>
        )}
      </div>
      {state === FileUploadState.Completed && onSearch && (
        <Button
          type="button"
          variant="primary"
          size="regular"
          onClick={onSearch}
          data-fs-file-upload-status-search-button
        >
          {searchButtonLabel}
        </Button>
      )}

      {state === FileUploadState.Error && (
        <div data-fs-file-upload-status-error-actions>
          {onDownloadTemplate && (
            <Button
              type="button"
              variant="secondary"
              size="regular"
              onClick={onDownloadTemplate}
              data-fs-file-upload-status-download-button
            >
              {downloadTemplateButtonLabel}
            </Button>
          )}
          {onSelectFile && (
            <Button
              type="button"
              variant="primary"
              size="regular"
              onClick={onSelectFile}
              data-fs-file-upload-status-select-button
            >
              {selectFileButtonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default FileUploadStatus
