import { useFadeEffect } from '@faststore/components'
import { useCallback, useState } from 'react'
import type { OrderActionType } from './MyAccountOrderActionModal'

export function useOrderActionModal() {
  const { fade, fadeOut, fadeIn } = useFadeEffect()

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    actionType: OrderActionType | null
  }>({
    isOpen: false,
    actionType: null,
  })

  const openDialog = useCallback((actionType: OrderActionType) => {
    setDialogState({
      isOpen: true,
      actionType,
    })
    fadeIn()
  }, [])

  const closeDialog = useCallback(() => {
    setDialogState({
      isOpen: false,
      actionType: null,
    })
    fadeOut()
  }, [])

  return {
    ...dialogState,
    fade,
    openDialog,
    closeDialog,
  }
}
