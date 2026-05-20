import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import FileUploadCard from '../../../src/molecules/FileUploadCard/FileUploadCard'
import { FileUploadErrorType } from '../../../src/molecules/FileUploadStatus/FileUploadStatus'

const defaultProps = {
  isOpen: true,
  title: 'File Upload',
  fileInputAriaLabel: 'Upload file',
  dropzoneAriaLabel: 'Drop zone',
  dropzoneTitle: 'Drop your file here or click to browse',
  selectFileButtonLabel: 'Select file',
  downloadTemplateButtonLabel: 'Download template',
  removeButtonAriaLabel: 'Remove file',
  searchButtonLabel: 'Search',
  uploadingStatusText: 'Uploading...',
  processingStatusText: 'Processing...',
  getCompletedStatusText: (size: number) =>
    `File ready (${(size / 1024).toFixed(1)} KB)`,
  errorMessages: {
    [FileUploadErrorType.Unexpected]: {
      title: 'Unexpected error',
      description: 'Please try again',
    },
    [FileUploadErrorType.Unsupported]: {
      title: 'Unsupported file type',
      description: 'Only CSV files are accepted',
    },
  },
}

afterEach(() => {
  cleanup()
})

describe('FileUploadCard', () => {
  it('renders the dropzone when no file is selected', () => {
    render(<FileUploadCard {...defaultProps} />)
    expect(
      screen.getByText('Drop your file here or click to browse')
    ).toBeInTheDocument()
    expect(screen.getByText('Select file')).toBeInTheDocument()
  })

  it('renders Download template button in dropzone', () => {
    render(<FileUploadCard {...defaultProps} />)
    expect(screen.getByText('Download template')).toBeInTheDocument()
  })

  it('calls onFileSelect with selected file', () => {
    const onFileSelect = vi.fn()
    render(<FileUploadCard {...defaultProps} onFileSelect={onFileSelect} />)

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    const csvFile = new File(['SKU,Qty\n001,1'], 'items.csv', {
      type: 'text/csv',
    })
    fireEvent.change(input, { target: { files: [csvFile] } })

    expect(onFileSelect).toHaveBeenCalledWith([csvFile])
  })

  it('shows FileUploadStatus after valid file is selected', () => {
    render(<FileUploadCard {...defaultProps} />)

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    const csvFile = new File(['SKU,Qty\n001,1'], 'items.csv', {
      type: 'text/csv',
    })
    fireEvent.change(input, { target: { files: [csvFile] } })

    expect(screen.getByText('items.csv')).toBeInTheDocument()
  })

  it('shows error state for unsupported file type', () => {
    render(
      <FileUploadCard
        {...defaultProps}
        accept=".csv"
        errorMessages={{
          [FileUploadErrorType.Unsupported]: {
            title: 'Unsupported file type',
            description: 'Only CSV files are accepted',
          },
        }}
      />
    )

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    const pdfFile = new File(['data'], 'document.pdf', {
      type: 'application/pdf',
    })
    fireEvent.change(input, { target: { files: [pdfFile] } })

    expect(screen.getByText('Unsupported file type')).toBeInTheDocument()
  })

  it('calls onSearch when search button is clicked after file ready', () => {
    const onSearch = vi.fn()
    render(<FileUploadCard {...defaultProps} onSearch={onSearch} />)

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    const csvFile = new File(['SKU,Qty'], 'items.csv', { type: 'text/csv' })
    fireEvent.change(input, { target: { files: [csvFile] } })

    fireEvent.click(screen.getByText('Search'))
    expect(onSearch).toHaveBeenCalledWith(csvFile)
  })

  it('clears file after remove button is clicked', () => {
    render(<FileUploadCard {...defaultProps} />)

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    const csvFile = new File(['SKU,Qty'], 'items.csv', { type: 'text/csv' })
    fireEvent.change(input, { target: { files: [csvFile] } })

    expect(screen.getByText('items.csv')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Remove file'))

    expect(screen.queryByText('items.csv')).not.toBeInTheDocument()
    expect(
      screen.getByText('Drop your file here or click to browse')
    ).toBeInTheDocument()
  })

  it('shows isUploading state when prop is true and file is selected', () => {
    render(<FileUploadCard {...defaultProps} isUploading={true} />)

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    const csvFile = new File(['SKU,Qty'], 'items.csv', { type: 'text/csv' })
    fireEvent.change(input, { target: { files: [csvFile] } })

    expect(screen.getByText('Uploading...')).toBeInTheDocument()
  })

  it('shows isProcessing state when prop is true and file is selected', () => {
    render(<FileUploadCard {...defaultProps} isProcessing={true} />)

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    const csvFile = new File(['SKU,Qty'], 'items.csv', { type: 'text/csv' })
    fireEvent.change(input, { target: { files: [csvFile] } })

    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })

  it('accepts multiple file types when accept prop includes them', () => {
    const onFileSelect = vi.fn()
    render(
      <FileUploadCard
        {...defaultProps}
        accept=".csv,.xlsx"
        onFileSelect={onFileSelect}
      />
    )

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    const xlsxFile = new File(['data'], 'items.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    fireEvent.change(input, { target: { files: [xlsxFile] } })

    expect(onFileSelect).toHaveBeenCalledWith([xlsxFile])
  })

  it('shows FileUploadStatus after valid file is dropped', () => {
    render(<FileUploadCard {...defaultProps} />)

    const dropzone = screen.getByRole('region', { name: 'Drop zone' })
    const csvFile = new File(['SKU,Qty\n001,1'], 'dropped.csv', {
      type: 'text/csv',
    })
    fireEvent.drop(dropzone, { dataTransfer: { files: [csvFile] } })

    expect(screen.getByText('dropped.csv')).toBeInTheDocument()
  })

  it('shows error state for unsupported file dropped', () => {
    render(
      <FileUploadCard
        {...defaultProps}
        accept=".csv"
        errorMessages={{
          [FileUploadErrorType.Unsupported]: {
            title: 'Unsupported file type',
            description: 'Only CSV files are accepted',
          },
        }}
      />
    )

    const dropzone = screen.getByRole('region', { name: 'Drop zone' })
    const pdfFile = new File(['data'], 'doc.pdf', { type: 'application/pdf' })
    fireEvent.drop(dropzone, { dataTransfer: { files: [pdfFile] } })

    expect(screen.getByText('Unsupported file type')).toBeInTheDocument()
  })

  it('sets dragActive on dragenter and clears on dragleave', () => {
    render(<FileUploadCard {...defaultProps} />)

    const dropzone = screen.getByRole('region', { name: 'Drop zone' })

    fireEvent.dragEnter(dropzone)
    expect(dropzone).toHaveAttribute(
      'data-fs-file-upload-card-dragging',
      'true'
    )

    fireEvent.dragLeave(dropzone)
    expect(dropzone).toHaveAttribute(
      'data-fs-file-upload-card-dragging',
      'false'
    )
  })

  it('calls onDismiss when Escape key is pressed and isOpen is true', () => {
    const onDismiss = vi.fn()
    render(<FileUploadCard {...defaultProps} onDismiss={onDismiss} />)

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does not call onDismiss on Escape when isOpen is false', () => {
    const onDismiss = vi.fn()
    render(
      <FileUploadCard {...defaultProps} isOpen={false} onDismiss={onDismiss} />
    )

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('shows error state from hasError prop after file is selected', () => {
    render(
      <FileUploadCard
        {...defaultProps}
        hasError
        errorType={FileUploadErrorType.Unexpected}
      />
    )

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    const csvFile = new File(['SKU,Qty'], 'items.csv', { type: 'text/csv' })
    fireEvent.change(input, { target: { files: [csvFile] } })

    expect(screen.getByText('Unexpected error')).toBeInTheDocument()
  })

  it('calls onDownloadTemplate when provided and download button is clicked', () => {
    const onDownloadTemplate = vi.fn()
    render(
      <FileUploadCard
        {...defaultProps}
        onDownloadTemplate={onDownloadTemplate}
      />
    )

    fireEvent.click(screen.getByText('Download template'))

    expect(onDownloadTemplate).toHaveBeenCalledTimes(1)
  })

  it('does not call onSearch when no file is selected', () => {
    const onSearch = vi.fn()
    render(<FileUploadCard {...defaultProps} onSearch={onSearch} />)

    // onSearch is only shown in FileUploadStatus which needs a file
    expect(screen.queryByText('Search')).not.toBeInTheDocument()
  })
})
