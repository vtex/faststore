import { useState, useCallback } from 'react'
import { useWorker, WORKER_STATUS } from '@koale/useworker'

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
}

export type CSVData = WorkerCSVData

export type CSVParserOptions = WorkerCSVOptions

export type CSVParserError = {
  message: string
  type: 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'FILE_ERROR'
}

export function useCSVParser(options: CSVParserOptions = {}) {
  const [error, setError] = useState<CSVParserError | null>(null)

  const [parseWorker, parseWorkerController] = useWorker(parseCSVInWorker)
  const [templateWorker, templateWorkerController] =
    useWorker(generateCSVTemplate)

  const isProcessing = parseWorkerController.status === WORKER_STATUS.RUNNING

  const readFileAsText = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const content = e.target?.result as string
        if (!content) {
          reject(new Error('Failed to read file'))
        } else {
          resolve(content)
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file, 'utf-8')
    })
  }, [])

  const onParseFile = useCallback(
    async (file: File): Promise<CSVData | null> => {
      try {
        setError(null)

        const fileContent = await readFileAsText(file)

        const result = await parseWorker(
          fileContent,
          file.name,
          file.size,
          options
        )

        return result
      } catch (err) {
        const error: CSVParserError = {
          message:
            err instanceof Error ? err.message : 'Failed to parse CSV file',
          type: 'PARSE_ERROR',
        }
        setError(error)
        return null
      }
    },
    [parseWorker, readFileAsText, options]
  )

  const onGenerateTemplate = useCallback(async (): Promise<string | null> => {
    try {
      const csvContent = await templateWorker()
      return csvContent
    } catch (err) {
      const error: CSVParserError = {
        message:
          err instanceof Error ? err.message : 'Failed to generate template',
        type: 'PARSE_ERROR',
      }
      setError(error)
      return null
    }
  }, [templateWorker])

  const onClearError = useCallback(() => {
    setError(null)
  }, [])

  const onKillWorkers = useCallback(() => {
    parseWorkerController.kill()
    templateWorkerController.kill()
  }, [parseWorkerController.kill, templateWorkerController.kill])

  return {
    error,
    isProcessing,
    isGeneratingTemplate:
      templateWorkerController.status === WORKER_STATUS.RUNNING,
    onParseFile,
    onGenerateTemplate,
    onClearError,
    onKillWorkers,
  }
}

const parseCSVInWorker = (
  fileContent: string,
  fileName: string,
  fileSize: number,
  options: WorkerCSVOptions = {}
): WorkerCSVData => {
  const defaultOptions = {
    skuColumnNames: ['sku', 'id', 'product', 'productid', 'item'],
    quantityColumnNames: ['quantity', 'qty', 'amount', 'count'],
    delimiter: ',',
    skipEmptyLines: true,
  }

  const config = { ...defaultOptions, ...options }

  const parseCSVLine = (line: string, delimiter = ','): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    let i = 0

    while (i < line.length) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i += 2
        } else {
          inQuotes = !inQuotes
          i++
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim())
        current = ''
        i++
      } else {
        current += char
        i++
      }
    }

    result.push(current.trim())
    return result
  }

  const detectDelimiter = (text: string): string => {
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
  }

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

  const normalizedContent = fileContent
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
  const lines = normalizedContent.split('\n')

  if (lines.length === 0) {
    throw new Error('File is empty')
  }

  const delimiter =
    config.delimiter === ','
      ? detectDelimiter(normalizedContent)
      : config.delimiter

  const parsedLines = lines
    .map((line) => line.trim())
    .filter((line) => (config.skipEmptyLines ? line.length > 0 : true))
    .map((line) => parseCSVLine(line, delimiter))

  if (parsedLines.length === 0) {
    throw new Error('No valid lines found in file')
  }

  if (parsedLines.length < 2) {
    throw new Error('File must contain at least a header row and one data row')
  }

  const headers = parsedLines[0]
  const rows = parsedLines.slice(1)

  const skuIndex = findColumnIndex(headers, config.skuColumnNames)
  const quantityIndex = findColumnIndex(headers, config.quantityColumnNames)

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

  const transformedData: Array<{ SKU: string; Quantity: number }> = []
  const errors: string[] = []

  rows.forEach((row, index) => {
    try {
      const sku = row[skuIndex]
      const quantity = row[quantityIndex]

      if (!sku || sku === '' || quantity === undefined || quantity === '') {
        return
      }

      const trimmedSku = sku.trim()
      const numericQuantity = Number(quantity.trim())

      if (!trimmedSku) {
        throw new Error('Empty SKU found')
      }

      if (isNaN(numericQuantity) || numericQuantity < 0) {
        throw new Error(
          `Invalid quantity value: ${quantity} for SKU: ${trimmedSku}`
        )
      }

      transformedData.push({
        SKU: trimmedSku,
        Quantity: numericQuantity,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      errors.push(`Row ${index + 2}: ${errorMessage}`)
    }
  })

  if (transformedData.length === 0) {
    if (errors.length > 0) {
      throw new Error(
        `No valid data found. Errors:\n${errors.slice(0, 5).join('\n')}`
      )
    }
  }

  return {
    data: transformedData,
    fileName,
    totalRows: transformedData.length,
    fileSize,
  }
}

const generateCSVTemplate = (): string => {
  const templateData = [
    { SKU: 'PROD-001', Quantity: 5 },
    { SKU: 'ITEM-234', Quantity: 12 },
    { SKU: 'SKU789', Quantity: 3 },
    { SKU: 'ABC-XYZ-456', Quantity: 8 },
    { SKU: 'SAMPLE-100', Quantity: 25 },
  ]

  const headers = 'SKU,Quantity'
  const rows = templateData.map((item) => `${item.SKU},${item.Quantity}`)

  return [headers, ...rows].join('\n')
}
