import Papa from 'papaparse'
import { useCallback, useState } from 'react'

export interface WorkerCSVData {
  data: Array<{ SKU: string; Quantity: number }>
  fileName: string
  totalRows: number
  fileSize: number
}

export interface WorkerCSVOptions {
  skuColumnNames?: string[]
  quantityColumnNames?: string[]
  delimiter?: string
  skipEmptyLines?: boolean
  chunkSize?: number
  onProgress?: (progress: {
    processed: number
    total: number
    percentage: number
  }) => void
}

export type CSVData = WorkerCSVData
export type CSVParserOptions = WorkerCSVOptions

export type CSVParserError = {
  message: string
  type: 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'FILE_ERROR'
}

/**
 * Hook to parse CSV files containing SKU and Quantity columns.
 * Utilizes PapaParse's native Web Worker for efficient parsing of large files.
 * Supports both comma (,) and semicolon (;) delimiters - automatically detects which one is used.
 * @param options CSV parsing options
 * @returns Object containing parsing state and functions
 */
export function useCSVParser(options: CSVParserOptions = {}) {
  const [error, setError] = useState<CSVParserError | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false)

  const onParseFile = useCallback(
    async (file: File): Promise<CSVData | null> => {
      try {
        setError(null)
        setIsProcessing(true)

        const result = await parseCSVFile(file, options)
        return result
      } catch (err) {
        const error: CSVParserError = {
          message:
            err instanceof Error ? err.message : 'Failed to parse CSV file',
          type: 'PARSE_ERROR',
        }
        setError(error)
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [options]
  )

  const onGenerateTemplate = useCallback(async (): Promise<string | null> => {
    try {
      setIsGeneratingTemplate(true)
      const csvContent = generateCSVTemplate()
      return csvContent
    } catch (err) {
      const error: CSVParserError = {
        message:
          err instanceof Error ? err.message : 'Failed to generate template',
        type: 'PARSE_ERROR',
      }
      setError(error)
      return null
    } finally {
      setIsGeneratingTemplate(false)
    }
  }, [])

  const onClearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    isProcessing,
    isGeneratingTemplate,
    onParseFile,
    onGenerateTemplate,
    onClearError,
  }
}

/**
 * Parse CSV file using PapaParse's native Web Worker
 */
const parseCSVFile = (
  file: File,
  options: WorkerCSVOptions = {}
): Promise<WorkerCSVData> => {
  return new Promise(async (resolve, reject) => {
    const defaultOptions = {
      skuColumnNames: ['sku', 'id', 'product', 'productid', 'item'],
      quantityColumnNames: ['quantity', 'qty', 'amount', 'count'],
      delimiter: '',
      skipEmptyLines: true,
      chunkSize: 1024 * 1024,
    }

    const config = { ...defaultOptions, ...options }

    const detectDelimiter = (): Promise<string> => {
      if (config.delimiter) {
        return Promise.resolve(config.delimiter)
      }

      return new Promise((resolveDelimiter) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result as string
          const firstLine = text.split('\n')[0] || text.split('\r\n')[0] || ''

          const commaCount = (firstLine.match(/,/g) || []).length
          const semicolonCount = (firstLine.match(/;/g) || []).length
          const tabCount = (firstLine.match(/\t/g) || []).length

          if (semicolonCount > 0 && semicolonCount >= commaCount) {
            resolveDelimiter(';')
          } else if (tabCount > commaCount && tabCount > semicolonCount) {
            resolveDelimiter('\t')
          } else {
            resolveDelimiter(',')
          }
        }
        reader.onerror = () => resolveDelimiter(',')
        reader.readAsText(file.slice(0, 1024))
      })
    }

    const detectedDelimiter = await detectDelimiter()

    let headers: string[] = []
    let skuIndex = -1
    let quantityIndex = -1
    let isHeaderProcessed = false

    const transformedData: Array<{ SKU: string; Quantity: number }> = []
    const errors: string[] = []
    let processedRows = 0
    let totalEstimatedRows = 0

    const findColumnIndex = (
      headers: string[],
      columnNames: string[]
    ): number => {
      return headers.findIndex((header) =>
        columnNames.some((name) =>
          header.toLowerCase().trim().includes(name.toLowerCase())
        )
      )
    }

    const validateAndTransformRow = (row: unknown[], rowIndex: number) => {
      try {
        const sku = row[skuIndex]
        const quantity = row[quantityIndex]

        if (!sku || sku === '' || quantity === undefined || quantity === '') {
          return null
        }

        const trimmedSku = String(sku).trim()
        const numericQuantity = Number(quantity)

        if (!trimmedSku) {
          throw new Error('Empty SKU found')
        }

        if (Number.isNaN(numericQuantity) || numericQuantity < 0) {
          throw new Error(
            `Invalid quantity value: ${quantity} for SKU: ${trimmedSku}`
          )
        }

        return {
          SKU: trimmedSku,
          Quantity: numericQuantity,
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error'
        errors.push(`Row ${rowIndex + 2}: ${errorMessage}`)

        if (errors.length > 1000) {
          errors.splice(0, 500)
        }

        return null
      }
    }

    const estimateRows = (fileSize: number) => {
      const avgBytesPerRow = 50
      return Math.floor(fileSize / avgBytesPerRow)
    }

    totalEstimatedRows = estimateRows(file.size)

    Papa.parse(file, {
      header: false,
      dynamicTyping: false,
      skipEmptyLines: config.skipEmptyLines,
      delimiter: detectedDelimiter,

      worker: true,

      chunk: (
        results: { data: unknown[][] },
        parser: { abort: () => void }
      ) => {
        try {
          if (!isHeaderProcessed && results.data.length > 0) {
            headers = results.data[0] as string[]

            skuIndex = findColumnIndex(headers, config.skuColumnNames)
            quantityIndex = findColumnIndex(headers, config.quantityColumnNames)

            if (skuIndex === -1) {
              parser.abort()
              reject(
                new Error(
                  `SKU column not found. Expected one of: ${config.skuColumnNames.join(', ')}`
                )
              )
              return
            }

            if (quantityIndex === -1) {
              parser.abort()
              reject(
                new Error(
                  `Quantity column not found. Expected one of: ${config.quantityColumnNames.join(', ')}`
                )
              )
              return
            }

            results.data = results.data.slice(1)
            isHeaderProcessed = true
          }

          results.data.forEach((row: any, index: number) => {
            const globalRowIndex = processedRows + index
            const transformedRow = validateAndTransformRow(row, globalRowIndex)

            if (transformedRow) {
              transformedData.push(transformedRow)
            }
          })

          processedRows += results.data.length

          if (config.onProgress) {
            const percentage = Math.min(
              100,
              Math.round((processedRows / totalEstimatedRows) * 100)
            )
            config.onProgress({
              processed: processedRows,
              total: totalEstimatedRows,
              percentage,
            })
          }
        } catch (err) {
          parser.abort()
          reject(err)
        }
      },

      complete: () => {
        try {
          if (transformedData.length === 0) {
            if (errors.length > 0) {
              reject(
                new Error(
                  `No valid data found. First few errors:\n${errors.slice(0, 5).join('\n')}`
                )
              )
            } else {
              reject(new Error('No valid data found in file'))
            }
            return
          }

          if (errors.length > 0) {
            console.warn(
              `CSV parsing completed with ${errors.length} warnings. Sample:`,
              errors.slice(0, 10)
            )
          }

          if (config.onProgress) {
            config.onProgress({
              processed: processedRows,
              total: processedRows,
              percentage: 100,
            })
          }

          resolve({
            data: transformedData,
            fileName: file.name,
            totalRows: transformedData.length,
            fileSize: file.size,
          })
        } catch (err) {
          reject(err)
        }
      },

      error: (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown parsing error'
        reject(new Error(`PapaParse error: ${errorMessage}`))
      },

      fastMode: false,
      chunkSize: config.chunkSize,
      preview: 0,
      encoding: 'UTF-8',
    })
  })
}

/**
 * Generate CSV template with sample data
 */
const generateCSVTemplate = (): string => {
  const templateData = [
    { SKU: 'PROD-001', Quantity: 5 },
    { SKU: 'ITEM-234', Quantity: 12 },
    { SKU: 'SKU789', Quantity: 3 },
    { SKU: 'ABC-XYZ-456', Quantity: 8 },
    { SKU: 'SAMPLE-100', Quantity: 25 },
  ]

  return Papa.unparse(templateData, {
    header: true,
    delimiter: ',',
    newline: '\n',
    skipEmptyLines: true,
  })
}
