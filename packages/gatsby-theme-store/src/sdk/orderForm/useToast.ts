import { useCallback } from 'react'
import { useToast as useToastFromProvider } from '@vtex/store-ui'

export const useToast = () => {
  const { toastState, showToast } = useToastFromProvider()

  const showToastWrapped = useCallback(
    (message: string) => {
      showToast({ message, duration: 3000 })
    },
    [showToast]
  )

  return {
    showToast: showToastWrapped,
    toastState: { isToastVisible: toastState.isVisible },
  }
}
