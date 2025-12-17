import { useEffect, useState } from 'react'

import {
  Button,
  Loader,
  Dropzone as UIDropzone,
  Icon as UIIcon,
  SearchDropdown as UISearchDropdown,
  useCSVParser,
  useUI,
  type CSVData,
  type DropzoneState,
} from '@faststore/ui'

import { formatFileName, formatFileSize } from 'src/utils/utilities'
import styles from './section.module.scss'

const MAX_FILES = 1
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = {
  'text/csv': ['.csv'],
}

export default function UploadFileDropdown() {
  const { pushToast } = useUI()

  const [csvData, setCsvData] = useState<CSVData | null>(null)

  const {
    error: csvError,
    isProcessing,
    onParseFile,
    onClearError,
    onGenerateTemplate,
  } = useCSVParser({
    delimiter: ',',
    skipEmptyLines: true,
    skuColumnNames: ['sku', 'id', 'product', 'productid', 'item'],
    quantityColumnNames: ['quantity', 'qty', 'amount', 'count'],
  })

  const clearData = () => {
    setCsvData(null)
    onClearError()
  }

  // Show toast notification when CSV parsing error occurs
  useEffect(() => {
    if (csvError) {
      pushToast({
        title: 'File Upload Error',
        message: csvError.message,
        status: 'ERROR',
        icon: (
          <UIIcon
            name="CircleWavyWarning"
            width={30}
            height={30}
            data-fs-upload-error-icon
          />
        ),
      })
    }
  }, [csvError, pushToast])

  const handleFilesAccepted = async (files: File[]) => {
    if (files.length === 0) return

    setCsvData(null)
    onClearError()

    const file = files[0]
    const parsedData = await onParseFile(file)

    if (parsedData) {
      setCsvData(parsedData)
    }
    // Error handling is done by the hook and displayed via csvError state
  }

  const handleFilesRejected = (
    fileRejections: DropzoneState['fileRejections']
  ) => {
    const code = fileRejections[0]?.errors[0]?.code || ''

    let errorMessage = 'Failed to upload file'

    if (code === 'file-too-large') {
      errorMessage = 'File is too large. Maximum size is 5MB.'
    } else if (code === 'file-invalid-type') {
      errorMessage = 'Invalid file type. Please upload a CSV file.'
    } else if (code === 'too-many-files') {
      errorMessage = 'Too many files. Please upload only one file.'
    }

    pushToast({
      title: 'File Upload Error',
      message: errorMessage,
      status: 'ERROR',
      icon: (
        <UIIcon
          name="CircleWavyWarning"
          width={30}
          height={30}
          data-fs-upload-error-icon
        />
      ),
    })
  }

  const handleDownloadTemplate = async () => {
    try {
      const csvContent = await onGenerateTemplate()

      if (csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'bulk-search-template.csv'
        a.click()
        window.URL.revokeObjectURL(url)

        pushToast({
          title: 'Template Downloaded',
          message: 'Template file has been downloaded successfully',
          status: 'INFO',
          icon: <UIIcon name="CircleWavyCheck" width={30} height={30} />,
        })
      }
    } catch (error) {
      pushToast({
        title: 'Download Failed',
        message: 'Failed to download template file. Please try again.',
        status: 'ERROR',
        icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
      })
    }
  }

  const handleUseData = () => {
    if (!csvData) return

    // TODO: Implement the logic to use the parsed CSV data
    console.log('Using data:', csvData.data)
  }

  return (
    <UISearchDropdown className={styles.section}>
      {csvData ? (
        <div data-fs-upload-results>
          <div data-fs-upload-result-info>
            <div data-fs-upload-result-file-details>
              <h3 data-fs-upload-result-file-name>
                {formatFileName(csvData.fileName)}
              </h3>
              <p data-fs-upload-result-file-rows>
                {isProcessing ? (
                  <Loader />
                ) : (
                  `Completed · ${formatFileSize(csvData.fileSize)} · ${
                    csvData.totalRows
                  } products found`
                )}
              </p>
            </div>
            <Button variant="tertiary" size="small" onClick={clearData}>
              <UIIcon name="X" data-fs-upload-clear-icon />
            </Button>
          </div>

          <div data-fs-upload-actions>
            <Button
              variant="primary"
              size="small"
              onClick={handleUseData}
              data-fs-upload-use-data-button
              disabled={isProcessing}
            >
              Search
            </Button>
          </div>
        </div>
      ) : (
        <div data-fs-dropzone-container>
          <UIDropzone
            selectFilesButton={
              <div data-fs-upload-button-container>
                <Button
                  data-fs-upload-button
                  type="button"
                  variant="secondary"
                  size="small"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Select File'}
                </Button>
              </div>
            }
            icon={<UIIcon name="ClipPlus" />}
            onFilesAccepted={handleFilesAccepted}
            onFilesRejected={handleFilesRejected}
            accept={ACCEPTED_FILE_TYPES}
            maxFiles={MAX_FILES}
            maxSize={MAX_FILE_SIZE}
            disabled={isProcessing}
            text="Drop a file to search in bulk"
            aria-label="Drop a file to search in bulk"
            dragActiveText="Drop a CSV file with SKU and Quantity columns"
          />
          <Button
            data-fs-download-template-button
            type="button"
            variant="tertiary"
            size="small"
            disabled={isProcessing}
            onClick={handleDownloadTemplate}
          >
            Download Template
          </Button>
        </div>
      )}

      {csvError && (
        <div data-fs-upload-error>
          <UIIcon name="CircleWavyWarning" data-fs-upload-error-icon />
          <p>{csvError.message}</p>
        </div>
      )}
    </UISearchDropdown>
  )
}
