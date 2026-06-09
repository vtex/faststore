import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import FileUploadStatus, {
  FileUploadErrorType,
  FileUploadState,
} from '../../../src/molecules/FileUploadStatus/FileUploadStatus'

const mockFile = new File(['SKU,Qty'], 'items.csv', { type: 'text/csv' })

const defaultProps = {
  file: mockFile,
  removeButtonAriaLabel: 'Remove file',
  searchButtonLabel: 'Search',
  downloadTemplateButtonLabel: 'Download template',
  selectFileButtonLabel: 'Select file',
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
  uploadingStatusText: 'Uploading...',
  processingStatusText: 'Processing...',
  completedStatusText: 'File ready (1.0 KB)',
}

afterEach(() => {
  cleanup()
})

describe('FileUploadStatus', () => {
  it('renders uploading state with uploading text', () => {
    render(
      <FileUploadStatus {...defaultProps} state={FileUploadState.Uploading} />
    )
    expect(screen.getByText('Uploading...')).toBeInTheDocument()
  })

  it('renders processing state with processing text', () => {
    render(
      <FileUploadStatus {...defaultProps} state={FileUploadState.Processing} />
    )
    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })

  it('renders completed state with completed text', () => {
    render(
      <FileUploadStatus {...defaultProps} state={FileUploadState.Completed} />
    )
    expect(screen.getByText('File ready (1.0 KB)')).toBeInTheDocument()
  })

  it('renders Search button only in completed state', () => {
    const onSearch = vi.fn()
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Completed}
        onSearch={onSearch}
      />
    )
    expect(screen.getByText('Search')).toBeInTheDocument()
  })

  it('does not render Search button in uploading state', () => {
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Uploading}
        onSearch={vi.fn()}
      />
    )
    expect(screen.queryByText('Search')).not.toBeInTheDocument()
  })

  it('calls onSearch when Search button is clicked', () => {
    const onSearch = vi.fn()
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Completed}
        onSearch={onSearch}
      />
    )
    fireEvent.click(screen.getByText('Search'))
    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('renders remove button and calls onRemove when clicked', () => {
    const onRemove = vi.fn()
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Uploading}
        onRemove={onRemove}
      />
    )
    fireEvent.click(screen.getByLabelText('Remove file'))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('does not render remove button when onRemove is not provided', () => {
    render(
      <FileUploadStatus {...defaultProps} state={FileUploadState.Uploading} />
    )
    expect(screen.queryByLabelText('Remove file')).not.toBeInTheDocument()
  })

  it('shows file name from fileName prop', () => {
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Completed}
        fileName="custom-name.csv"
      />
    )
    expect(screen.getByText('custom-name.csv')).toBeInTheDocument()
  })

  it('falls back to file.name when fileName prop is not provided', () => {
    render(
      <FileUploadStatus {...defaultProps} state={FileUploadState.Completed} />
    )
    expect(screen.getByText('items.csv')).toBeInTheDocument()
  })

  it('renders error state with errorType message', () => {
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Error}
        errorType={FileUploadErrorType.Unsupported}
      />
    )
    expect(screen.getByText('Unsupported file type')).toBeInTheDocument()
    expect(screen.getByText('Only CSV files are accepted')).toBeInTheDocument()
  })

  it('prefers custom errorMessage over errorType', () => {
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Error}
        errorType={FileUploadErrorType.Unsupported}
        errorMessage="Custom error message"
      />
    )
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Unsupported file type')).not.toBeInTheDocument()
  })

  it('falls back to unexpected error message when errorType has no entry', () => {
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Error}
        errorType={FileUploadErrorType.Empty}
      />
    )
    expect(screen.getByText('Unexpected error')).toBeInTheDocument()
  })

  it('renders Download template button in error state when onDownloadTemplate provided', () => {
    const onDownloadTemplate = vi.fn()
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Error}
        errorType={FileUploadErrorType.Unexpected}
        onDownloadTemplate={onDownloadTemplate}
      />
    )
    fireEvent.click(screen.getByText('Download template'))
    expect(onDownloadTemplate).toHaveBeenCalledTimes(1)
  })

  it('renders Select file button in error state when onSelectFile provided', () => {
    const onSelectFile = vi.fn()
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Error}
        errorType={FileUploadErrorType.Unexpected}
        onSelectFile={onSelectFile}
      />
    )
    fireEvent.click(screen.getByText('Select file'))
    expect(onSelectFile).toHaveBeenCalledTimes(1)
  })

  it('uses default Importing... text when processingStatusText is not provided', () => {
    const { processingStatusText: _, ...propsWithoutProcessing } = defaultProps
    render(
      <FileUploadStatus
        {...propsWithoutProcessing}
        state={FileUploadState.Processing}
      />
    )
    expect(screen.getByText('Importing...')).toBeInTheDocument()
  })

  it('shows empty strings when error state has no matching or unexpected errorMessages', () => {
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Error}
        errorType={FileUploadErrorType.Empty}
        errorMessages={{}}
      />
    )
    // Component renders without crashing and shows empty error content
    expect(screen.getByTestId('fs-file-upload-status')).toBeInTheDocument()
  })

  it('uses testId to identify the root element', () => {
    render(
      <FileUploadStatus
        {...defaultProps}
        state={FileUploadState.Uploading}
        testId="custom-test-id"
      />
    )
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })
})
