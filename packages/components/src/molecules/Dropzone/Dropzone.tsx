import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef, useCallback } from 'react'
import { useDropzone, type Accept, type FileRejection } from 'react-dropzone'

export interface DropzoneProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
  /**
   * Callback function called when files are accepted.
   */
  onFilesAccepted?: (files: File[]) => void
  /**
   * Callback function called when files are rejected.
   */
  onFilesRejected?: (fileRejections: FileRejection[]) => void
  /**
   * Maximum number of files that can be selected.
   */
  maxFiles?: number
  /**
   * Maximum file size in bytes.
   */
  maxSize?: number
  /**
   * Minimum file size in bytes.
   */
  minSize?: number
  /**
   * Accepted file types.
   */
  accept?: Accept
  /**
   * Whether multiple files can be selected.
   */
  multiple?: boolean
  /**
   * Whether the dropzone is disabled.
   */
  disabled?: boolean
  /**
   * Custom text to display when dragging files over the dropzone.
   */
  dragActiveText?: string
  /**
   * Custom text to display in the dropzone.
   */
  text?: string
  /**
   * Whether to show the file input (hidden by default).
   */
  noClick?: boolean
  /**
   * Whether to prevent drag events on the document body.
   */
  noKeyboard?: boolean
  /**
   * Whether to prevent dropping on the document body.
   */
  noDrag?: boolean
  /**
   * Custom content for the select files button.
   */
  selectFilesButton?: ReactNode
}

export interface DropzoneState {
  acceptedFiles: File[]
  fileRejections: FileRejection[]
}

const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(function Dropzone(
  {
    icon,
    testId = 'fs-dropzone',
    children,
    onFilesAccepted,
    onFilesRejected,
    maxFiles = 0,
    maxSize,
    minSize,
    accept,
    multiple = true,
    disabled = false,
    dragActiveText = 'Drop the files here...',
    text = 'Drag and drop files here, or click to select files',
    noClick = false,
    noKeyboard = false,
    noDrag = false,
    selectFilesButton = null,
    ...otherProps
  },
  ref
) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (onFilesAccepted && acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles)
      }
    },
    [onFilesAccepted]
  )

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      if (onFilesRejected && fileRejections.length > 0) {
        onFilesRejected(fileRejections)
      }
    },
    [onFilesRejected]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    onDropRejected,
    accept,
    maxFiles,
    maxSize,
    minSize,
    multiple,
    disabled,
    noClick,
    noKeyboard,
    noDrag,
  })

  return (
    <div
      ref={ref}
      data-fs-dropzone
      data-fs-dropzone-drag-active={isDragActive}
      data-fs-dropzone-drag-accept={isDragAccept}
      data-fs-dropzone-drag-reject={isDragReject}
      data-fs-dropzone-disabled={disabled}
      data-testid={testId}
      {...getRootProps()}
      {...otherProps}
    >
      <input {...getInputProps()} />

      {icon && <div data-fs-dropzone-icon>{icon}</div>}

      <div data-fs-dropzone-content>
        {isDragActive ? (
          <p data-fs-dropzone-text>{dragActiveText}</p>
        ) : (
          <>{children || <p data-fs-dropzone-text>{text}</p>}</>
        )}

        {selectFilesButton && !noClick && !disabled && selectFilesButton}
      </div>

      {acceptedFiles.length > 0 && (
        <div data-fs-dropzone-files>
          <ul>
            {acceptedFiles.map((file, index) => (
              <li key={index} data-fs-dropzone-file>
                {file.name} - {file.size} bytes
              </li>
            ))}
          </ul>
        </div>
      )}

      {fileRejections.length > 0 && (
        <div data-fs-dropzone-errors>
          <ul>
            {fileRejections.map(({ file, errors }, index) => (
              <li key={index} data-fs-dropzone-error>
                {file.name} - {errors.map((e) => e.message).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
})

export default Dropzone
