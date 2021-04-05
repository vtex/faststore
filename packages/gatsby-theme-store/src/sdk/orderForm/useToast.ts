import { useCallback } from 'react'

import { useToast as useToastFromProvider } from '../toast/useToast'

export const useToast = () => {
  const { showToast, isVisible } = useToastFromProvider()

  const showToastWrapped = useCallback(
    (message: string) => {
      showToast({ message, duration: 3000 })
    },
    [showToast]
  )

  return {
    showToast: showToastWrapped,
    toastState: { isToastVisible: isVisible },
  }
}
