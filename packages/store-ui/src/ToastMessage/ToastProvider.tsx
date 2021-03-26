import React, { useCallback, useMemo, useState } from 'react'
import type { FC } from 'react'

import { ToastContext } from './ToastContext'
import type {
  Context as ToastContextType,
  State as ToastState,
  ShowToastParams,
} from './ToastContext'

const ToastProvider: FC = ({ children }) => {
  const [toastState, setToastState] = useState<ToastState>({
    isVisible: false,
  })

  const hideToast = useCallback(() => {
    setToastState({ isVisible: false })
  }, [])

  const showToast = useCallback<ToastContextType['showToast']>(
    (options: ShowToastParams) => {
      const duration = options?.duration ?? 3000

      setToastState((prevState) => ({
        ...prevState,
        message: options?.message ?? prevState.message,
        isVisible: true,
      }))

      setTimeout(() => setToastState({ isVisible: false }), duration)
    },
    []
  )

  const value = useMemo<ToastContextType>(() => {
    return {
      showToast,
      hideToast,
      toastState,
    }
  }, [showToast, hideToast, toastState])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export default ToastProvider
