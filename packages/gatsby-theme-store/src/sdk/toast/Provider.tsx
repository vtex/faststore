import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { FC } from 'react'

export interface State {
  isVisible: boolean
  message: string
  type?: 'error' | 'warning' | 'success'
}

interface ShowToastOptions
  extends Pick<State, Exclude<keyof State, 'isVisible'>> {
  duration?: number
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

  const timeoutRef = useRef(0)

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, isVisible: false }))
  }, [])

  const showToast = useCallback<IContext['showToast']>(
    ({ duration = 3000, message, type }: ShowToastOptions) => {
      setToastState((prevState) => ({
        ...prevState,
        message,
        isVisible: true,
        type,
      }))

      timeoutRef.current = (setTimeout(
        () => setToastState((prev) => ({ ...prev, isVisible: false })),
        duration
      ) as unknown) as number
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
