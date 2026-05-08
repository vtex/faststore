import { useCallback } from 'react'

import { useCart } from '../cart'
import { useOrderEntryOperation } from './useOrderEntryOperation'
import { useOrderEntryUpload } from './useOrderEntryUpload'

export function useOrderEntry() {
  const cart = useCart()

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
      await startOperation({
        objectKey,
        orderFormId: cart.id ?? '',
      })
    },
    [uploadFile, startOperation, cart.id]
  )

  return {
    submitFile,
    status,
    isLoading: isUploading || isOperating,
    error: uploadError ? new Error(uploadError.message) : operationError,
    reset,
  }
}
