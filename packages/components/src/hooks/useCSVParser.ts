import { useWorker, WORKER_STATUS } from '@koale/useworker'
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
 * Utilizes Web Workers for efficient parsing of large files.
 * @param options CSV parsing options
 * @returns Object containing parsing state and functions
 */
export function useCSVParser(options: CSVParserOptions = {}) {
  const [error, setError] = useState<CSVParserError | null>(null)

  const [parseWorker, parseWorkerController] = useWorker(parseCSVInWorker)
  const [templateWorker, templateWorkerController] =
    useWorker(generateCSVTemplate)

  const isProcessing = parseWorkerController.status === WORKER_STATUS.RUNNING

  const onParseFile = useCallback(
    async (file: File): Promise<CSVData | null> => {
      try {
        setError(null)

        const result = await parseWorker(file, options)
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
    [parseWorker, options]
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
  file: File,
  options: WorkerCSVOptions = {}
): Promise<WorkerCSVData> => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      skuColumnNames: ['sku', 'id', 'product', 'productid', 'item'],
      quantityColumnNames: ['quantity', 'qty', 'amount', 'count'],
      delimiter: '',
      skipEmptyLines: true,
      chunkSize: 10000,
    }

    const config = { ...defaultOptions, ...options }

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

        // Limitar erros para evitar uso excessivo de memória
        if (errors.length > 1000) {
          errors.splice(0, 500)
        }

        return null
      }
    }

    // Estimar número total de linhas baseado no tamanho do arquivo
    const estimateRows = (fileSize: number) => {
      const avgBytesPerRow = 50 // Estimativa conservadora
      return Math.floor(fileSize / avgBytesPerRow)
    }

    totalEstimatedRows = estimateRows(file.size)

    Papa.parse(file, {
      // Configurações de performance
      header: false, // Vamos processar o header manualmente
      dynamicTyping: false, // Manter como string para validação customizada
      skipEmptyLines: config.skipEmptyLines,
      delimiter: config.delimiter || '', // Auto-detect se vazio

      // Processamento em chunks para melhor performance
      chunk: (results, parser) => {
        try {
          // Processar header na primeira execução
          if (!isHeaderProcessed && results.data.length > 0) {
            headers = results.data[0] as string[]

            // Encontrar índices das colunas
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

            // Remover header dos dados para processar apenas as linhas de dados
            results.data = results.data.slice(1)
            isHeaderProcessed = true
          }

          // Processar chunk atual
          results.data.forEach((row: any, index: number) => {
            const globalRowIndex = processedRows + index
            const transformedRow = validateAndTransformRow(row, globalRowIndex)

            if (transformedRow) {
              transformedData.push(transformedRow)
            }
          })

          processedRows += results.data.length

          // Callback de progresso se fornecido
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
          // Verificar se temos dados válidos
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

          // Log warnings se houver erros não críticos
          if (errors.length > 0) {
            console.warn(
              `CSV parsing completed with ${errors.length} warnings. Sample:`,
              errors.slice(0, 10)
            )
          }

          // Progresso final
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

      error: (error) => {
        reject(new Error(`PapaParse error: ${error.message}`))
      },

      // Configurações adicionais de performance
      fastMode: false, // Desabilitado para suportar aspas e caracteres especiais
      step: undefined, // Usar chunk em vez de step para melhor performance
      chunkSize: config.chunkSize, // Tamanho do chunk em bytes
      preview: 0, // Processar arquivo completo
      encoding: 'UTF-8',
      worker: false, // Já estamos em um Worker, não precisamos de outro
    })
  })
}

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
