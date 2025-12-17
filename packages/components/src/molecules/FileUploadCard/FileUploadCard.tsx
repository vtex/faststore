import type { ChangeEvent, DragEvent, HTMLAttributes } from 'react'
import React, { useEffect, useRef, useState } from 'react'

import { Button, Card, Icon, Input } from '../..'
import { useOnClickOutside } from '../../hooks'
import FileUploadStatus, {
  type FileUploadErrorType,
  type FileUploadState,
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
   * Formatter for file size display.
   */
  formatterFileSize?: (size: number) => string
  /**
   * Formatter for file name display.
   */
  formatterFileName?: (name: string) => string
  /**
   * Indicates if the file is being uploaded.
   */
  isUploading?: boolean
  /**
   * Indicates if there was an error during file upload.
   */
  hasError?: boolean
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
  formatterFileSize,
  formatterFileName,
  isUploading = false,
  hasError = false,
  ...otherProps
}: FileUploadCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<FileUploadState>('uploading')
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

  useEffect(() => {
    if (hasError && selectedFile) {
      setUploadState('error')
      setErrorType('invalid-structure')
    } else if (!hasError && selectedFile && !isUploading) {
      setUploadState('completed')
      setErrorType(undefined)
    }
  }, [hasError, selectedFile, isUploading])

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

      if (!isValidFileType(file)) {
        setUploadState('error')
        setErrorType('unsupported')
        return
      }

      setErrorType(undefined)

      if (isUploading) {
        setUploadState('uploading')
      } else {
        setUploadState('completed')
      }

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

      if (!isValidFileType(file)) {
        setUploadState('error')
        setErrorType('unsupported')
        return
      }

      setErrorType(undefined)

      if (isUploading) {
        setUploadState('uploading')
      } else {
        setUploadState('completed')
      }

      if (onFileSelect) {
        onFileSelect(files)
      }
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    fileInputRef.current?.click()
  }

  const handleDownloadTemplate = () => {
    if (onDownloadTemplate) {
      onDownloadTemplate()
    } else {
      const csvContent = 'SKU,Quantity\nAB001,2\nAB100,5\nAB999,49'
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
    setUploadState('uploading')
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
      title="File Upload"
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
        aria-label="File upload input"
      />

      {selectedFile ? (
        <FileUploadStatus
          file={selectedFile}
          state={uploadState}
          errorType={errorType}
          onRemove={handleRemoveFile}
          onSearch={handleSearch}
          onDownloadTemplate={handleDownloadTemplate}
          onSelectFile={triggerFileInput}
          fileName={
            formatterFileName
              ? formatterFileName(selectedFile.name)
              : selectedFile.name
          }
          completedText={
            formatterFileSize
              ? `Completed • ${formatterFileSize(selectedFile.size)}`
              : 'Completed'
          }
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
          aria-label="Drop a file to search in bulk"
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

          <p data-fs-file-upload-card-title>Drop a file to search in bulk</p>

          <Button
            variant="secondary"
            size="regular"
            onClick={triggerFileInput}
            data-fs-file-upload-card-select-button
          >
            Select file
          </Button>

          <Button
            type="button"
            onClick={handleDownloadTemplate}
            data-fs-file-upload-card-template-link
          >
            Download template
          </Button>
        </div>
      )}
    </Card>
  )
}

export default FileUploadCard
