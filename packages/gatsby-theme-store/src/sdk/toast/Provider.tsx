import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { FC } from 'react'

import { uuidv4 } from '../uuid'

interface Message {
  content: string
  type?: 'error' | 'warning' | 'success'
  id: string
}

export interface State {
  messages: Message[]
}

interface ShowToastOptions extends Omit<Message, 'id'> {
  id?: Message['id']
  duration?: number
}

export interface IContext extends State {
  showToast: (options: ShowToastOptions) => void
  hideToast: (id: NonNullable<Message['id']>) => void
}

export const Context = createContext<IContext | undefined>(undefined)

export const Provider: FC = ({ children }) => {
  const [toastState, setToastState] = useState<State>({
    messages: [],
  })

  const timeoutRef = useRef<Record<string, number>>({})

  useEffect(() => {
    const copyTimeoutRef = timeoutRef

    return () => {
      Object.values(copyTimeoutRef.current).forEach((timeoutId) =>
        clearTimeout(timeoutId)
      )
    }
  }, [])

  const hideToast = useCallback<IContext['hideToast']>(
    (id: NonNullable<Message['id']>) => {
      setToastState((prevToastState) => ({
        messages: prevToastState.messages.filter(
          (message) => message.id !== id
        ),
      }))
      clearTimeout(timeoutRef.current[id])
      delete timeoutRef.current[id]
    },
    []
  )

  const setMessageCloseTimeout = useCallback(
    ({ id, duration }) => {
      timeoutRef.current[id] = (setTimeout(() => {
        hideToast(id)
      }, duration) as unknown) as number
    },
    [hideToast]
  )

  const showToast = useCallback<IContext['showToast']>(
    ({ duration = 3000, content, type, id }: ShowToastOptions) => {
      if (
        id &&
        toastState.messages.filter((message) => message.id === id).length > 0
      ) {
        setMessageCloseTimeout({ id, duration })

        return
      }

      const msgId = id ?? uuidv4()

      setToastState((prevToastState) => ({
        isVisible: true,
        messages: prevToastState.messages.concat([
          { content, type: type ?? 'success', id: msgId },
        ]),
      }))

      setMessageCloseTimeout({ id: msgId, duration })
    },
    [toastState, setMessageCloseTimeout]
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
