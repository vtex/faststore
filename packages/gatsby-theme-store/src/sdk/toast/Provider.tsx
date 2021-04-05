import React, { createContext, useCallback, useState } from 'react'
import type { FC } from 'react'

export interface ShowToastOptions {
  message: string
  duration?: number
}

export interface State {
  isVisible: boolean
  message: string
}

export interface IContext extends State {
  showToast: (options: ShowToastOptions) => void
  hideToast: () => void
}

export const Context = createContext<IContext | undefined>(undefined)

export const Provider: FC = ({ children }) => {
  const [toastState, setToastState] = useState<State>({
    isVisible: false,
    message: '',
  })

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, isVisible: false }))
  }, [])

  const showToast = useCallback<IContext['showToast']>(
    ({ duration = 3000, message }: ShowToastOptions) => {
      setToastState((prevState) => ({
        ...prevState,
        message,
        isVisible: true,
      }))

      // TODO: fix on umounted component
      setTimeout(
        () => setToastState((prev) => ({ ...prev, isVisible: false })),
        duration
      )
    },
    []
  )

  return (
    <Context.Provider
      value={{
        showToast,
        hideToast,
        ...toastState,
      }}
    >
      {children}
    </Context.Provider>
  )
}
