import { useCallback, useState } from 'react'

import { useCart } from '../cart'
import { useOrderEntryOperation } from './useOrderEntryOperation'
import { useOrderEntryUpload } from './useOrderEntryUpload'

export function useOrderEntry() {
  const cart = useCart()

  const [isOperationStarting, setIsOperationStarting] = useState(false)

  const { uploadFile, isUploading, error: uploadError } = useOrderEntryUpload()
  const {
    startOperation,
    status,
    isLoading: isOperating,
    error: operationError,
    reset,
  } = useOrderEntryOperation()

  const submitFile = useCallback(
    async (file: File) => {
      const objectKey = await uploadFile(file)
      if (!objectKey) return
      setIsOperationStarting(true)
      try {
        await startOperation({
          objectKey,
          orderFormId: cart.id ?? '',
        })
      } finally {
        setIsOperationStarting(false)
      }
    },
    [uploadFile, startOperation, cart.id]
  )

  return {
    submitFile,
    status,
    isLoading: isUploading || isOperationStarting || isOperating,
    isUploading,
    isProcessing: isOperationStarting || isOperating,
    error: uploadError ? new Error(uploadError.message) : operationError,
    reset,
  }
}
