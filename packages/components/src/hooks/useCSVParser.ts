import { useState, useCallback } from 'react'

export type CSVData = {
  data: Array<{ SKU: string; Quantity: number }>
  fileName: string
  totalRows: number
  fileSize: number
}

export type CSVParserOptions = {
  skuColumnNames?: string[]
  quantityColumnNames?: string[]
  delimiter?: string
  skipEmptyLines?: boolean
}

export type CSVParserError = {
  message: string
  type: 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'FILE_ERROR'
}

const DEFAULT_OPTIONS: Required<CSVParserOptions> = {
  skuColumnNames: ['sku', 'id', 'product', 'productid', 'item'],
  quantityColumnNames: ['quantity', 'qty', 'amount', 'count'],
  delimiter: ',',
  skipEmptyLines: true,
}

/**
 * Hook to parse CSV files and extract SKU and Quantity data.
 * @param options Configuration options for the CSV parser.
 * @returns An object containing parsing state and functions.
 */
export function useCSVParser(options: CSVParserOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<CSVParserError | null>(null)

  const config = { ...DEFAULT_OPTIONS, ...options }

  const parseCSVLine = useCallback(
    (line: string, delimiter = ','): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      let i = 0

      while (i < line.length) {
        const char = line[i]
        const nextChar = line[i + 1]

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Escaped quote
            current += '"'
            i += 2
          } else {
            // Toggle quote state
            inQuotes = !inQuotes
            i++
          }
        } else if (char === delimiter && !inQuotes) {
          // End of field
          result.push(current.trim())
          current = ''
          i++
        } else {
          current += char
          i++
        }
      }

      // Add the last field
      result.push(current.trim())
      return result
    },
    []
  )

  const detectDelimiter = useCallback((text: string): string => {
    const delimiters = [',', ';', '\t', '|']
    const firstLine = text.split('\n')[0]

    let bestDelimiter = ','
    let maxCount = 0

    delimiters.forEach((delimiter) => {
      const count = (firstLine.match(new RegExp(`\\${delimiter}`, 'g')) || [])
        .length
      if (count > maxCount) {
        maxCount = count
        bestDelimiter = delimiter
      }
    })

    return bestDelimiter
  }, [])

  const findColumnIndex = useCallback(
    (headers: string[], columnNames: string[]): number => {
      return headers.findIndex((header) =>
        columnNames.some((name) =>
          header.toLowerCase().trim().includes(name.toLowerCase())
        )
      )
    },
    []
  )

  const validateRow = useCallback(
    (row: string[], skuIndex: number, quantityIndex: number) => {
      const sku = row[skuIndex]
      const quantity = row[quantityIndex]

      // Check if row has required data
      if (!sku || sku === '' || quantity === undefined || quantity === '') {
        return null
      }

      const trimmedSku = sku.trim()
      const numericQuantity = Number(quantity.trim())

      // Validate SKU
      if (!trimmedSku) {
        throw new Error('Empty SKU found')
      }

      // Validate quantity
      if (isNaN(numericQuantity) || numericQuantity < 0) {
        throw new Error(
          `Invalid quantity value: ${quantity} for SKU: ${trimmedSku}`
        )
      }

      return {
        SKU: trimmedSku,
        Quantity: numericQuantity,
      }
    },
    []
  )

  const parseCSVContent = useCallback(
    (content: string): { headers: string[]; rows: string[][] } => {
      // Normalize line endings
      const normalizedContent = content
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')

      // Split into lines
      const lines = normalizedContent.split('\n')

      if (lines.length === 0) {
        throw new Error('File is empty')
      }

      // Detect delimiter
      const delimiter =
        config.delimiter === ','
          ? detectDelimiter(normalizedContent)
          : config.delimiter

      // Parse lines
      const parsedLines = lines
        .map((line) => line.trim())
        .filter((line) => (config.skipEmptyLines ? line.length > 0 : true))
        .map((line) => parseCSVLine(line, delimiter))

      if (parsedLines.length === 0) {
        throw new Error('No valid lines found in file')
      }

      if (parsedLines.length < 2) {
        throw new Error(
          'File must contain at least a header row and one data row'
        )
      }

      const headers = parsedLines[0]
      const rows = parsedLines.slice(1)

      return { headers, rows }
    },
    [parseCSVLine, detectDelimiter, config.delimiter, config.skipEmptyLines]
  )

  const parseFile = useCallback(
    async (file: File): Promise<CSVData> => {
      setIsProcessing(true)
      setError(null)

      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            if (!content) {
              throw new Error('Failed to read file')
            }

            // Parse CSV content
            const { headers, rows } = parseCSVContent(content)

            // Find required column indices
            const skuIndex = findColumnIndex(headers, config.skuColumnNames)
            const quantityIndex = findColumnIndex(
              headers,
              config.quantityColumnNames
            )

            if (skuIndex === -1) {
              throw new Error(
                `SKU column not found. Expected one of: ${config.skuColumnNames.join(', ')}`
              )
            }

            if (quantityIndex === -1) {
              throw new Error(
                `Quantity column not found. Expected one of: ${config.quantityColumnNames.join(', ')}`
              )
            }

            // Transform and validate data
            const transformedData: Array<{ SKU: string; Quantity: number }> = []
            const errors: string[] = []

            rows.forEach((row, index) => {
              try {
                const validatedRow = validateRow(row, skuIndex, quantityIndex)
                if (validatedRow) {
                  transformedData.push(validatedRow)
                }
              } catch (err) {
                const errorMessage =
                  err instanceof Error ? err.message : 'Unknown error'
                errors.push(`Row ${index + 2}: ${errorMessage}`)
              }
            })

            // Check if we have any valid data
            if (transformedData.length === 0) {
              if (errors.length > 0) {
                throw new Error(
                  `No valid data found. Errors:\n${errors.slice(0, 5).join('\n')}`
                )
              }
            }

            // Log errors but continue if we have some valid data
            if (errors.length > 0) {
              console.warn('CSV parsing warnings:', errors)
            }

            const result: CSVData = {
              data: transformedData,
              fileName: file.name,
              totalRows: transformedData.length,
              fileSize: file.size,
            }

            resolve(result)
          } catch (err) {
            const error: CSVParserError = {
              message:
                err instanceof Error ? err.message : 'Unknown parsing error',
              type: 'PARSE_ERROR',
            }
            reject(error)
          }
        }

        reader.onerror = () => {
          const error: CSVParserError = {
            message: 'Failed to read file',
            type: 'FILE_ERROR',
          }
          reject(error)
        }

        reader.readAsText(file, 'utf-8')
      })
    },
    [parseCSVContent, findColumnIndex, validateRow, config]
  )

  const onParseFile = useCallback(
    async (file: File): Promise<CSVData | null> => {
      try {
        const result = await parseFile(file)
        return result
      } catch (err) {
        const error = err as CSVParserError
        setError(error)
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [parseFile]
  )

  const onClearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    isProcessing,
    onClearError,
    onParseFile,
  }
}
