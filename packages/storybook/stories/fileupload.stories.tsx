import {
  FileUploadCard,
  FileUploadErrorType,
  FileUploadStatus,
  FileUploadState,
  SearchInputField,
} from '@faststore/components'
import React, { useState } from 'react'

export default {
  title: 'FileUpload',
}

const fileUploadCardTextProps = {
  title: 'File Upload',
  fileInputAriaLabel: 'File upload input',
  dropzoneAriaLabel: 'Drop a file to search in bulk',
  dropzoneTitle: 'Drop a file to search in bulk',
  selectFileButtonLabel: 'Select file',
  downloadTemplateButtonLabel: 'Download template',
}

const fileUploadStatusErrorMessages = {
  [FileUploadErrorType.Unexpected]: {
    title: 'Upload failed.',
    description:
      'An unexpected error occurred. Try again or upload a new file.',
  },
  [FileUploadErrorType.Unsupported]: {
    title: 'Unsupported file type.',
    description: 'Upload a CSV or use the template provided.',
  },
  [FileUploadErrorType.Unreadable]: {
    title: "File can't be read.",
    description: "Make sure it's correctly formatted and not corrupted.",
  },
  [FileUploadErrorType.InvalidStructure]: {
    title: 'Invalid structure.',
    description: 'Check missing headers or columns and try again.',
  },
  [FileUploadErrorType.Empty]: {
    title: 'File is empty.',
    description: 'Add items to your file and upload it again.',
  },
  [FileUploadErrorType.TooLarge]: {
    title: 'File too large.',
    description: 'Split it into smaller files and try again.',
  },
}

const fileUploadStatusTextProps = {
  removeButtonAriaLabel: 'Remove file',
  searchButtonLabel: 'Search',
  downloadTemplateButtonLabel: 'Download template',
  selectFileButtonLabel: 'Select file',
  uploadingStatusText: 'Uploading your file...',
  getCompletedStatusText: (size: number) =>
    `Completed • ${(size / 1024).toFixed(0)} KB`,
}

export function FileUploadCardDefault() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ margin: '16px', position: 'relative' }}>
      <FileUploadCard
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        onFileSelect={(files: File[]) => {
          console.log('Files selected:', files)
        }}
        onDownloadTemplate={() => {
          console.log('Download template clicked')
        }}
        onSearch={(file: File) => {
          console.log('Search with file:', file)
        }}
        {...fileUploadCardTextProps}
        removeButtonAriaLabel={fileUploadStatusTextProps.removeButtonAriaLabel}
        searchButtonLabel={fileUploadStatusTextProps.searchButtonLabel}
        uploadingStatusText={fileUploadStatusTextProps.uploadingStatusText}
        getCompletedStatusText={
          fileUploadStatusTextProps.getCompletedStatusText
        }
        errorMessages={fileUploadStatusErrorMessages}
      />
      <button onClick={() => setIsOpen(!isOpen)} style={{ marginTop: '200px' }}>
        {isOpen ? 'Close' : 'Open'} File Upload Card
      </button>
    </div>
  )
}

export function FileUploadStatusUploading() {
  const file = new File(['content'], 'example.csv', { type: 'text/csv' })

  return (
    <div style={{ margin: '16px', maxWidth: '600px' }}>
      <FileUploadStatus
        file={file}
        state={FileUploadState.Uploading}
        onRemove={() => console.log('Remove clicked')}
        removeButtonAriaLabel={fileUploadStatusTextProps.removeButtonAriaLabel}
        searchButtonLabel={fileUploadStatusTextProps.searchButtonLabel}
        downloadTemplateButtonLabel={
          fileUploadStatusTextProps.downloadTemplateButtonLabel
        }
        selectFileButtonLabel={fileUploadStatusTextProps.selectFileButtonLabel}
        errorMessages={fileUploadStatusErrorMessages}
        uploadingStatusText={fileUploadStatusTextProps.uploadingStatusText}
        completedStatusText={fileUploadStatusTextProps.getCompletedStatusText(
          file.size
        )}
      />
    </div>
  )
}

export function FileUploadStatusCompleted() {
  const file = new File(['content'], 'example.csv', { type: 'text/csv' })

  return (
    <div style={{ margin: '16px', maxWidth: '600px' }}>
      <FileUploadStatus
        file={file}
        state={FileUploadState.Completed}
        onRemove={() => console.log('Remove clicked')}
        onSearch={() => console.log('Search clicked')}
        removeButtonAriaLabel={fileUploadStatusTextProps.removeButtonAriaLabel}
        searchButtonLabel={fileUploadStatusTextProps.searchButtonLabel}
        downloadTemplateButtonLabel={
          fileUploadStatusTextProps.downloadTemplateButtonLabel
        }
        selectFileButtonLabel={fileUploadStatusTextProps.selectFileButtonLabel}
        errorMessages={fileUploadStatusErrorMessages}
        uploadingStatusText={fileUploadStatusTextProps.uploadingStatusText}
        completedStatusText={fileUploadStatusTextProps.getCompletedStatusText(
          file.size
        )}
      />
    </div>
  )
}

export function FileUploadStatusError() {
  const file = new File(['content'], 'example.txt', { type: 'text/plain' })

  return (
    <div style={{ margin: '16px', maxWidth: '600px' }}>
      <FileUploadStatus
        file={file}
        state={FileUploadState.Error}
        errorType={FileUploadErrorType.Unsupported}
        errorMessages={fileUploadStatusErrorMessages}
        onRemove={() => console.log('Remove clicked')}
        onDownloadTemplate={() => console.log('Download template clicked')}
        onSelectFile={() => console.log('Select file clicked')}
        removeButtonAriaLabel={fileUploadStatusTextProps.removeButtonAriaLabel}
        searchButtonLabel={fileUploadStatusTextProps.searchButtonLabel}
        downloadTemplateButtonLabel={
          fileUploadStatusTextProps.downloadTemplateButtonLabel
        }
        selectFileButtonLabel={fileUploadStatusTextProps.selectFileButtonLabel}
        uploadingStatusText={fileUploadStatusTextProps.uploadingStatusText}
        completedStatusText={fileUploadStatusTextProps.getCompletedStatusText(
          file.size
        )}
      />
    </div>
  )
}

export function FileUploadStatusAllErrorTypes() {
  const file = new File(['content'], 'example.csv', { type: 'text/csv' })
  const errorTypes: FileUploadErrorType[] = [
    FileUploadErrorType.Unexpected,
    FileUploadErrorType.Unsupported,
    FileUploadErrorType.Unreadable,
    FileUploadErrorType.InvalidStructure,
    FileUploadErrorType.Empty,
    FileUploadErrorType.TooLarge,
  ]

  return (
    <div
      style={{
        margin: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {errorTypes.map((errorType) => (
        <div key={errorType} style={{ maxWidth: '600px' }}>
          <h3
            style={{
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {errorType}
          </h3>
          <FileUploadStatus
            file={file}
            state={FileUploadState.Error}
            errorType={errorType}
            errorMessages={fileUploadStatusErrorMessages}
            onRemove={() => console.log('Remove clicked')}
            onDownloadTemplate={() => console.log('Download template clicked')}
            onSelectFile={() => console.log('Select file clicked')}
            removeButtonAriaLabel={
              fileUploadStatusTextProps.removeButtonAriaLabel
            }
            searchButtonLabel={fileUploadStatusTextProps.searchButtonLabel}
            downloadTemplateButtonLabel={
              fileUploadStatusTextProps.downloadTemplateButtonLabel
            }
            selectFileButtonLabel={
              fileUploadStatusTextProps.selectFileButtonLabel
            }
            uploadingStatusText={fileUploadStatusTextProps.uploadingStatusText}
            completedStatusText={fileUploadStatusTextProps.getCompletedStatusText(
              file.size
            )}
          />
        </div>
      ))}
    </div>
  )
}

export function SearchInputFieldWithFileUpload() {
  const [fileUploadVisible, setFileUploadVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleDownloadTemplate = () => {
    console.log('Download template clicked')
    // Create and download template file
    const csvContent = 'Product ID,Quantity,Price\n001,10,99.99\n002,5,49.99'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div style={{ margin: '16px', position: 'relative', maxWidth: '600px' }}>
      <SearchInputField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        showAttachmentButton={true}
        aria-label="Search products"
        attachmentButtonAriaLabel="Attach File"
        submitButtonAriaLabel="Submit Search"
        attachmentButtonProps={{
          onClick: () => {
            setFileUploadVisible(!fileUploadVisible)
            console.log('Attachment clicked')
          },
        }}
        placeholder="Search products..."
        onSubmit={(value) => {
          console.log('Search submitted:', value)
        }}
      />
      {fileUploadVisible && (
        <FileUploadCard
          isOpen={fileUploadVisible}
          onDismiss={() => setFileUploadVisible(false)}
          onFileSelect={(files: File[]) => {
            console.log('Files selected:', files)
          }}
          onDownloadTemplate={handleDownloadTemplate}
          onSearch={(file: File) => {
            console.log('Search with file:', file)
            setFileUploadVisible(false)
          }}
          {...fileUploadCardTextProps}
          removeButtonAriaLabel={
            fileUploadStatusTextProps.removeButtonAriaLabel
          }
          searchButtonLabel={fileUploadStatusTextProps.searchButtonLabel}
          uploadingStatusText={fileUploadStatusTextProps.uploadingStatusText}
          getCompletedStatusText={
            fileUploadStatusTextProps.getCompletedStatusText
          }
          errorMessages={fileUploadStatusErrorMessages}
        />
      )}
    </div>
  )
}
