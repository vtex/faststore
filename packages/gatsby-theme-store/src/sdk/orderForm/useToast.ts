import { useCallback } from 'react'

import { useToast as useToastFromProvider } from '../toast/useToast'

export const useToast = () => {
  const { showToast } = useToastFromProvider()

  const showToastWrapped = useCallback(
    (message: string) => {
      showToast({ content: message, duration: 5000, type: 'error' })
    },
    [showToast]
  )

  return {
    showToast: showToastWrapped,
    toastState: { isToastVisible: false }, // this value is always false to allow stack orderform messages
  }
}
