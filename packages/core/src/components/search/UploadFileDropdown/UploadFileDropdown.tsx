import { useEffect, useMemo, useState } from 'react'

import {
  Button,
  Dropzone as UIDropzone,
  FileRejectionCode,
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
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
}

// ------------------------------------------------------------------
// Props & default labels
// ------------------------------------------------------------------

export interface UploadFileDropdownLabels {
  /** Toast title shown when a CSV/Excel parsing error occurs. */
  toastErrorTitle?: string
  /** Toast title shown when a file is rejected (wrong type / too large / too many). */
  toastRejectionTitle?: string
  /** Default toast message when a file is rejected for an unknown reason. */
  toastRejectionDefaultMessage?: string
  /** Toast message when the file is too large. */
  toastFileTooLargeMessage?: string
  /** Toast message when the file type is invalid. */
  toastFileInvalidTypeMessage?: string
  /** Toast message when too many files are dropped. */
  toastTooManyFilesMessage?: string
  /** Toast title shown when the template generation fails. */
  toastDownloadFailedTitle?: string
  /** Toast message shown when the template generation fails. */
  toastDownloadFailedMessage?: string
  /** Toast title shown after a successful template download. */
  toastDownloadSuccessTitle?: string
  /** Toast message shown after a successful template download. */
  toastDownloadSuccessMessage?: string
  /** Label for the "Search" action button. */
  searchButtonLabel?: string
  /** Label for the "Select File" button inside the dropzone. */
  selectFileButtonLabel?: string
  /** Label shown on the button while a file is being processed. */
  processingButtonLabel?: string
  /** Label for the "Download Template" button. */
  downloadTemplateButtonLabel?: string
  /** Text shown inside the dropzone area. */
  dropzoneText?: string
  /** Accessible label for the dropzone. */
  dropzoneAriaLabel?: string
  /** Text shown when a file is being dragged over the dropzone. */
  dropzoneDragActiveText?: string
  /** File name used when downloading the CSV template. */
  templateFileName?: string
  /** Accessible label for the clear / dismiss button (the "X" icon button). */
  clearButtonAriaLabel?: string
  /**
   * Builds the "completed" status text shown after parsing.
   * Receives the formatted file size string and the total row count.
   */
  getCompletedStatusText?: (fileSize: string, totalRows: number) => string
}

export interface UploadFileDropdownProps {
  /** Customisable labels / copy. Every key is optional and falls back to an English default. */
  labels?: UploadFileDropdownLabels
}
// TODO: remove default labels once CMS is integrated

const DEFAULT_LABELS: Required<UploadFileDropdownLabels> = {
  toastErrorTitle: 'File Upload Error',
  toastRejectionTitle: 'File Upload Error',
  toastRejectionDefaultMessage: 'Failed to upload file',
  toastFileTooLargeMessage: 'File is too large. Maximum size is 5MB.',
  toastFileInvalidTypeMessage:
    'Invalid file type. Please upload a CSV or Excel file.',
  toastTooManyFilesMessage: 'Too many files. Please upload only one file.',
  toastDownloadFailedTitle: 'Download Failed',
  toastDownloadFailedMessage:
    'Failed to download template file. Please try again.',
  toastDownloadSuccessTitle: 'Template Downloaded',
  toastDownloadSuccessMessage:
    'Template file has been downloaded successfully',
  searchButtonLabel: 'Search',
  selectFileButtonLabel: 'Select File',
  processingButtonLabel: 'Processing...',
  downloadTemplateButtonLabel: 'Download Template',
  dropzoneText: 'Drop a file to search in bulk',
  dropzoneAriaLabel: 'Drop a file to search in bulk',
  dropzoneDragActiveText:
    'Drop a CSV or Excel file with SKU and Quantity columns',
  templateFileName: 'bulk-search-template.csv',
  clearButtonAriaLabel: 'Clear uploaded file',
  getCompletedStatusText: (fileSize, totalRows) =>
    `Completed · ${fileSize} · ${totalRows} products found`,
}

const isExcelFile = (file: File): boolean => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext === 'xls' || ext === 'xlsx'
}

const parseXLSXFile = async (file: File): Promise<CSVData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          throw new Error('Failed to read file')
        }

        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
        })

        if (!jsonData || jsonData.length === 0) {
          throw new Error('File is empty or invalid')
        }

        const headers = jsonData[0] as string[]
        const rows = jsonData.slice(1) as string[][]

        const skuIndex = headers.findIndex(
          (header) =>
            header?.toLowerCase().includes('sku') ||
            header?.toLowerCase().includes('id') ||
            header?.toLowerCase().includes('product')
        )

        const quantityIndex = headers.findIndex(
          (header) =>
            header?.toLowerCase().includes('quantity') ||
            header?.toLowerCase().includes('qty') ||
            header?.toLowerCase().includes('amount')
        )

        if (skuIndex === -1) {
          throw new Error(
            'SKU column not found. Please ensure your file has a column with "SKU", "ID", or "Product" in the header.'
          )
        }

        if (quantityIndex === -1) {
          throw new Error(
            'Quantity column not found. Please ensure your file has a column with "Quantity", "Qty", or "Amount" in the header.'
          )
        }

        const transformedData = rows
          .filter(
            (row) =>
              row[skuIndex] &&
              row[skuIndex] !== '' &&
              row[quantityIndex] !== undefined &&
              row[quantityIndex] !== ''
          )
          .map((row) => {
            const sku = String(row[skuIndex]).trim()
            const quantity = Number(row[quantityIndex])

            if (isNaN(quantity) || quantity < 0) {
              throw new Error(
                `Invalid quantity value: ${row[quantityIndex]} for SKU: ${sku}`
              )
            }

            return { sku, quantity }
          })

        if (transformedData.length === 0) {
          throw new Error('No valid data found. Please check your file format.')
        }

        resolve({
          data: transformedData,
          fileName: file.name,
          totalRows: transformedData.length,
          fileSize: file.size,
        })
      } catch (err) {
        reject(
          new Error(
            `Failed to parse file: ${
              err instanceof Error ? err.message : 'Unknown error'
            }`
          )
        )
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsBinaryString(file)
  })
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

export default function UploadFileDropdown({
  labels: labelsProp,
}: UploadFileDropdownProps = {}) {
  const labels = useMemo<Required<UploadFileDropdownLabels>>(
    () => ({ ...DEFAULT_LABELS, ...labelsProp }),
    [labelsProp]
  )

  const { pushToast } = useUI()

  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [isExcelParsing, setIsExcelParsing] = useState(false)

  const isProcessing = isParsing || isExcelParsing

  const csvOptions = useMemo(
    () => ({
      delimiter: ',' as const,
      skipEmptyLines: true,
      skuColumnNames: ['sku', 'id', 'product', 'productid', 'item'],
      quantityColumnNames: ['quantity', 'qty', 'amount', 'count'],
    }),
    []
  )

  const {
    error: csvError,
    isParsing,
    onParseFile,
    onClearError,
    onGenerateTemplate,
  } = useCSVParser(csvOptions)

  const clearData = () => {
    setCsvData(null)
    onClearError()
  }

  // Show toast notification when CSV parsing error occurs
  useEffect(() => {
    if (csvError) {
      pushToast({
        title: labels.toastErrorTitle,
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
  }, [csvError, pushToast, labels.toastErrorTitle])

  const handleFilesAccepted = async (files: File[]) => {
    if (files.length === 0) return

    setCsvData(null)
    onClearError()

    const file = files[0]

    if (isExcelFile(file)) {
      setIsExcelParsing(true)
      try {
        const parsedData = await parseXLSXFile(file)
        setCsvData(parsedData)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to process file'
        pushToast({
          title: labels.toastErrorTitle,
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
      } finally {
        setIsExcelParsing(false)
      }
    } else {
      const parsedData = await onParseFile(file)
      if (parsedData) {
        setCsvData(parsedData)
      }
    }
  }

  const handleFilesRejected = (
    fileRejections: DropzoneState['fileRejections']
  ) => {
    const code = fileRejections[0]?.errors[0]?.code || ''

    let errorMessage = labels.toastRejectionDefaultMessage

    if (code === FileRejectionCode.FileTooLarge) {
      errorMessage = labels.toastFileTooLargeMessage
    } else if (code === FileRejectionCode.FileInvalidType) {
      errorMessage = labels.toastFileInvalidTypeMessage
    } else if (code === FileRejectionCode.TooManyFiles) {
      errorMessage = labels.toastTooManyFilesMessage
    }

    pushToast({
      title: labels.toastRejectionTitle,
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

      if (!csvContent) {
        pushToast({
          title: labels.toastDownloadFailedTitle,
          message: labels.toastDownloadFailedMessage,
          status: 'ERROR',
          icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
        })
        return
      }

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = labels.templateFileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      pushToast({
        title: labels.toastDownloadSuccessTitle,
        message: labels.toastDownloadSuccessMessage,
        status: 'INFO',
        icon: <UIIcon name="CircleWavyCheck" width={30} height={30} />,
      })
    } catch (error) {
      pushToast({
        title: labels.toastDownloadFailedTitle,
        message: labels.toastDownloadFailedMessage,
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
                {labels.getCompletedStatusText(
                  formatFileSize(csvData.fileSize),
                  csvData.totalRows
                )}
              </p>
            </div>
            <Button
              variant="tertiary"
              size="small"
              onClick={clearData}
              aria-label={labels.clearButtonAriaLabel}
            >
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
              {labels.searchButtonLabel}
            </Button>
          </div>
        </div>
      ) : (
        <div data-fs-dropzone-container>
          <UIDropzone
            ariaLabel={labels.dropzoneAriaLabel}
            selectFilesButton={
              <div data-fs-upload-button-container>
                <Button
                  data-fs-upload-button
                  type="button"
                  variant="secondary"
                  size="small"
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? labels.processingButtonLabel
                    : labels.selectFileButtonLabel}
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
            text={labels.dropzoneText}
            dragActiveText={labels.dropzoneDragActiveText}
          />
          <Button
            data-fs-download-template-button
            type="button"
            variant="tertiary"
            size="small"
            disabled={isProcessing}
            onClick={handleDownloadTemplate}
          >
            {labels.downloadTemplateButtonLabel}
          </Button>
        </div>
      )}
    </UISearchDropdown>
  )
}
