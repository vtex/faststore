import type { ChangeEvent, DragEvent, HTMLAttributes } from 'react'
import React, { useEffect, useRef, useState } from 'react'

import { Button, Card, Icon, Input } from '../..'
import { useOnClickOutside } from '../../hooks'
import FileUploadStatus, {
  FileUploadErrorType,
  FileUploadState,
} from '../FileUploadStatus/FileUploadStatus'

export interface FileUploadCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Controls whether the component is visible.
   */
  isOpen: boolean
  /**
   * Callback function when the component should be closed.
   */
  onDismiss?: () => void
  /**
   * Callback function when a file is selected.
   */
  onFileSelect?: (files: File[]) => void
  /**
   * Callback function when download template is clicked.
   */
  onDownloadTemplate?: () => void
  /**
   * Callback function when search button is clicked after file upload.
   */
  onSearch?: (file: File) => void
  /**
   * Accepted file types.
   * @default '.csv'
   */
  accept?: string
  /**
   * Allow multiple file selection.
   * @default false
   */
  multiple?: boolean
  /**
   * Card title (e.g. from CMS).
   */
  title: string
  /**
   * Aria-label for the file input (e.g. from CMS).
   */
  fileInputAriaLabel: string
  /**
   * Aria-label for the dropzone region (e.g. from CMS).
   */
  dropzoneAriaLabel: string
  /**
   * Dropzone title text (e.g. from CMS).
   */
  dropzoneTitle: string
  /**
   * Label for the select file button (e.g. from CMS).
   */
  selectFileButtonLabel: string
  /**
   * Label for the download template button (e.g. from CMS).
   */
  downloadTemplateButtonLabel: string
  /**
   * Aria-label for the remove button in FileUploadStatus (e.g. from CMS).
   */
  removeButtonAriaLabel: string
  /**
   * Label for the search button in FileUploadStatus (e.g. from CMS).
   */
  searchButtonLabel: string
  /**
   * Status text when uploading in FileUploadStatus (e.g. from CMS).
   */
  uploadingStatusText: string
  /**
   * Status text when completed in FileUploadStatus (e.g. from CMS). Receives file size in bytes.
   */
  getCompletedStatusText?: (fileSize: number) => string
  /**
   * Error messages per error type for FileUploadStatus (e.g. from CMS).
   */
  errorMessages?: Partial<
    Record<FileUploadErrorType, { title: string; description: string }>
  >
}

const FileUploadCard = ({
  testId = 'fs-file-upload-card',
  isOpen,
  onDismiss,
  onFileSelect,
  onDownloadTemplate,
  onSearch,
  accept = '.csv',
  multiple = false,
  title,
  fileInputAriaLabel,
  dropzoneAriaLabel,
  dropzoneTitle,
  selectFileButtonLabel,
  downloadTemplateButtonLabel,
  removeButtonAriaLabel,
  searchButtonLabel,
  uploadingStatusText,
  getCompletedStatusText,
  errorMessages,
  ...otherProps
}: FileUploadCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<FileUploadState>(
    FileUploadState.Uploading
  )
  const [errorType, setErrorType] = useState<FileUploadErrorType | undefined>(
    undefined
  )

  useOnClickOutside(isOpen ? containerRef : undefined, () => {
    if (isOpen) {
      onDismiss?.()
    }
  })

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onDismiss?.()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onDismiss])

  const isValidFileType = (file: File): boolean => {
    const fileName = file.name.toLowerCase()
    const validExtensions = ['.csv']
    return validExtensions.some((ext) => fileName.endsWith(ext))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const file = files[0]
      setSelectedFile(file)

      // Validate file type
      if (!isValidFileType(file)) {
        setUploadState(FileUploadState.Error)
        setErrorType(FileUploadErrorType.Unsupported)
        return
      }

      setUploadState(FileUploadState.Uploading)
      setErrorType(undefined)

      // Simulate upload process
      setTimeout(() => {
        setUploadState(FileUploadState.Completed)
      }, 2000)

      if (onFileSelect) {
        onFileSelect(files)
      }
    }
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    if (!isOpen) return
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (!isOpen) return
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      const file = files[0]
      setSelectedFile(file)

      // Validate file type
      if (!isValidFileType(file)) {
        setUploadState(FileUploadState.Error)
        setErrorType(FileUploadErrorType.Unsupported)
        return
      }

      setUploadState(FileUploadState.Uploading)
      setErrorType(undefined)

      // Simulate upload process
      setTimeout(() => {
        setUploadState(FileUploadState.Completed)
      }, 2000)

      if (onFileSelect) {
        onFileSelect(files)
      }
    }
  }

  const triggerFileInput = () => {
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    fileInputRef.current?.click()
  }

  const handleDownloadTemplate = () => {
    if (onDownloadTemplate) {
      onDownloadTemplate()
    } else {
      // Default template download
      const csvContent = 'Product ID,Quantity,Price\n001,10,99.99\n002,5,49.99'
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'template.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadState(FileUploadState.Uploading)
    setErrorType(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSearch = () => {
    if (selectedFile && onSearch) {
      onSearch(selectedFile)
    }
  }

  return (
    <Card
      ref={containerRef}
      title={title}
      data-fs-file-upload-card
      data-fs-file-upload-card-open={isOpen}
      data-fs-file-upload-card-has-file={selectedFile !== null}
      testId={testId}
      aria-hidden={!isOpen}
      {...otherProps}
    >
      <Input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        aria-label={fileInputAriaLabel}
      />

      {selectedFile ? (
        <FileUploadStatus
          file={selectedFile}
          state={uploadState}
          errorType={errorType}
          errorMessages={errorMessages}
          onRemove={handleRemoveFile}
          onSearch={handleSearch}
          onDownloadTemplate={handleDownloadTemplate}
          onSelectFile={triggerFileInput}
          removeButtonAriaLabel={removeButtonAriaLabel}
          searchButtonLabel={searchButtonLabel}
          downloadTemplateButtonLabel={downloadTemplateButtonLabel}
          selectFileButtonLabel={selectFileButtonLabel}
          uploadingStatusText={uploadingStatusText}
          completedStatusText={getCompletedStatusText?.(selectedFile.size)}
        />
      ) : (
        <div
          data-fs-file-upload-card-dropzone
          data-fs-file-upload-card-dragging={dragActive}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          role="region"
          aria-label={dropzoneAriaLabel}
        >
          <div data-fs-file-upload-card-icon>
            <div data-fs-file-upload-card-icon-shadow />
            <div data-fs-file-upload-card-icon-wrapper>
              <Icon name="Paperclip" width={24} height={32} />
            </div>
            <div data-fs-file-upload-card-icon-badge>
              <Icon name="Plus" width={16} height={16} />
            </div>
          </div>

          <p data-fs-file-upload-card-title>{dropzoneTitle}</p>

          <Button
            variant="secondary"
            size="regular"
            onClick={triggerFileInput}
            data-fs-file-upload-card-select-button
          >
            {selectFileButtonLabel}
          </Button>

          <Button
            type="button"
            onClick={handleDownloadTemplate}
            data-fs-file-upload-card-template-link
          >
            {downloadTemplateButtonLabel}
          </Button>
        </div>
      )}
    </Card>
  )
}

export default FileUploadCard
