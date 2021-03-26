import { createContext, useContext } from 'react'

export interface ShowToastParams {
  message?: string
  duration?: number
}

export interface State {
  isVisible: boolean
  message?: string
}

export interface Context {
  showToast: (options: ShowToastParams) => void
  hideToast: () => void
  toastState: State
}

export const ToastContext = createContext<Context>({
  showToast: () => {},
  hideToast: () => {},
  toastState: {
    isVisible: false,
  },
})

export const useToast = () => useContext(ToastContext)
