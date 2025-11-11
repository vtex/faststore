import { useState } from 'react'
import * as XLSX from 'xlsx'

import {
  Button,
  Icon as UIIcon,
  Dropzone as UIDropzone,
  SearchDropdown as UISearchDropdown,
  type DropzoneState,
  useUI,
} from '@faststore/ui'

import styles from './section.module.scss'
import { formatFileName } from 'src/utils/utilities'

const MAX_FILES = 1
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = {
  'text/csv': ['.csv'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
}

type CSVData = {
  data: Array<{ SKU: string; Quantity: number }>
  fileName: string
  totalRows: number
}

export default function UploadFileDropdown() {
  const { pushToast } = useUI()

  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parseCSVFile = async (file: File): Promise<CSVData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result
          if (!data) {
            throw new Error('Failed to read file')
          }

          // Parse the file using XLSX
          const workbook = XLSX.read(data, { type: 'binary' })

          // Get the first sheet
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]

          // Convert to JSON array of objects
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '', // Default value for empty cells
          })

          if (!jsonData || jsonData.length === 0) {
            throw new Error('File is empty or invalid')
          }

          // Get headers and rows
          const headers = jsonData[0] as string[]
          const rows = jsonData.slice(1) as string[][]

          // Find SKU and Quantity column indices
          const skuIndex = headers.findIndex(
            (header) =>
              header.toLowerCase().includes('sku') ||
              header.toLowerCase().includes('id') ||
              header.toLowerCase().includes('product')
          )

          const quantityIndex = headers.findIndex(
            (header) =>
              header.toLowerCase().includes('quantity') ||
              header.toLowerCase().includes('qty') ||
              header.toLowerCase().includes('amount')
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

          // Transform data to the required format
          const transformedData = rows
            .filter(
              (row) =>
                // Filter out empty rows
                row[skuIndex] &&
                row[skuIndex] !== '' &&
                row[quantityIndex] !== undefined &&
                row[quantityIndex] !== ''
            )
            .map((row) => {
              const sku = String(row[skuIndex]).trim()
              const quantity = Number(row[quantityIndex])

              // Validate quantity is a valid number
              if (isNaN(quantity) || quantity < 0) {
                throw new Error(
                  `Invalid quantity value: ${row[quantityIndex]} for SKU: ${sku}`
                )
              }

              return {
                SKU: sku,
                Quantity: quantity,
              }
            })

          if (transformedData.length === 0) {
            throw new Error(
              'No valid data found. Please check your file format.'
            )
          }

          resolve({
            data: transformedData,
            fileName: file.name,
            totalRows: transformedData.length,
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

  const clearData = () => {
    setCsvData(null)
    setError(null)
  }

  const handleFilesAccepted = async (files: File[]) => {
    if (files.length === 0) return

    setIsProcessing(true)
    setError(null)
    setCsvData(null)

    try {
      const file = files[0]
      const parsedData = await parseCSVFile(file)
      setCsvData(parsedData)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to process file'

      setError(errorMessage)
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
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFilesRejected = (
    fileRejections: DropzoneState['fileRejections']
  ) => {
    const code = fileRejections[0]?.errors[0]?.code || ''

    let errorMessage = 'Failed to upload file'

    if (code === 'file-too-large') {
      errorMessage = 'File is too large. Maximum size is 5MB.'
    } else if (code === 'file-invalid-type') {
      errorMessage =
        'Invalid file type. Please upload a CSV, XLS, or XLSX file.'
    } else if (code === 'too-many-files') {
      errorMessage = 'Too many files. Please upload only one file.'
    }

    setError(errorMessage)
  }

  const handleDownloadTemplate = () => {
    const finalHeaders = ['SKU', 'Quantity']
    const data = [
      { SKU: 'AB120', Quantity: 2 },
      { SKU: 'AB121', Quantity: 3 },
      { SKU: 'AB122', Quantity: 5 },
      { SKU: 'AB123', Quantity: 10 },
      { SKU: 'AB124', Quantity: 1 },
      { SKU: 'AB125', Quantity: 20 },
    ]

    const ws = XLSX.utils.json_to_sheet(data, { header: finalHeaders })
    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS')
    XLSX.writeFile(wb, 'template-search-sku-quantity.xlsx')
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
                {`Completed · ${csvData.totalRows} products found`}
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
            dragActiveText="Drop a CSV/Excel file with SKU and Quantity columns"
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

      {/* Loading state */}
      {isProcessing && (
        <div data-fs-upload-loading>
          <UIIcon name="CircleNotch" />
          <p>Processing file...</p>
        </div>
      )}

      {error && (
        <div data-fs-upload-error>
          <UIIcon name="CircleWavyWarning" data-fs-upload-error-icon />
          <p>{error}</p>
        </div>
      )}
    </UISearchDropdown>
  )
}
