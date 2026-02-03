import {
  FileUploadCard,
  FileUploadStatus,
  SearchInputField,
} from '@faststore/components'
import type { FileUploadErrorType } from '@faststore/components/dist/esm/molecules/FileUploadStatus'
import React, { useState } from 'react'

export default {
  title: 'FileUpload',
}

export function FileUploadCardDefault() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ margin: '16px', position: 'relative' }}>
      <FileUploadCard
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        onFileSelect={(files) => {
          console.log('Files selected:', files)
        }}
        onDownloadTemplate={() => {
          console.log('Download template clicked')
        }}
        onSearch={(file) => {
          console.log('Search with file:', file)
        }}
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
        state="uploading"
        onRemove={() => console.log('Remove clicked')}
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
        state="completed"
        onRemove={() => console.log('Remove clicked')}
        onSearch={() => console.log('Search clicked')}
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
        state="error"
        errorType="unsupported"
        onRemove={() => console.log('Remove clicked')}
        onDownloadTemplate={() => console.log('Download template clicked')}
        onSelectFile={() => console.log('Select file clicked')}
      />
    </div>
  )
}

export function FileUploadStatusAllErrorTypes() {
  const file = new File(['content'], 'example.csv', { type: 'text/csv' })
  const errorTypes: FileUploadErrorType[] = [
    'unexpected',
    'unsupported',
    'unreadable',
    'invalid-structure',
    'empty',
    'too-large',
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
            state="error"
            errorType={errorType}
            onRemove={() => console.log('Remove clicked')}
            onDownloadTemplate={() => console.log('Download template clicked')}
            onSelectFile={() => console.log('Select file clicked')}
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
          onFileSelect={(files) => {
            console.log('Files selected:', files)
          }}
          onDownloadTemplate={handleDownloadTemplate}
          onSearch={(file) => {
            console.log('Search with file:', file)
            setFileUploadVisible(false)
          }}
        />
      )}
    </div>
  )
}
