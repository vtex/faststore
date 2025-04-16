import type { PropsWithChildren, ReactNode, RefObject } from 'react'
import React, { createContext, useContext, useMemo, useReducer } from 'react'

export interface Toast {
  message: string
  status: 'ERROR' | 'WARNING' | 'INFO'
  title?: string
  icon?: ReactNode
}

export interface Popover {
  isOpen: boolean
  triggerRef?: RefObject<HTMLElement>
}

interface State {
  /** Cart sidebar */
  cart: boolean
  /** Region modal */
  modal: boolean
  /** Menu slider */
  navbar: boolean
  /** Search page filter slider */
  filter: boolean
  /** Toast notifications */
  toasts: Toast[]
  /** Region Popover */
  popover: Popover
}

type UIElement = 'navbar' | 'cart' | 'modal' | 'filter'

type Action =
  | {
      type: 'open'
      payload: UIElement
    }
  | {
      type: 'close'
      payload: UIElement
    }
  | {
      type: 'pushToast'
      payload: Toast
    }
  | {
      type: 'popToast'
    }
  | {
      type: 'openPopover'
      payload: {
        isOpen: boolean
        triggerRef?: RefObject<HTMLElement>
      }
    }
  | {
      type: 'closePopover'
    }

const reducer = (state: State, action: Action): State => {
  const { type } = action

  switch (type) {
    case 'open': {
      const { payload } = action

      document.body.classList.add('no-scroll')

      return {
        ...state,
        [payload]: true,
      }
    }

    case 'close': {
      const { payload } = action

      document.body.classList.remove('no-scroll')

      return {
        ...state,
        [payload]: false,
      }
    }

    case 'pushToast': {
      const isDuplicate = state.toasts.some(
        (existingToast) =>
          existingToast.message === action.payload.message &&
          existingToast.status === action.payload.status
      )

      if (isDuplicate) {
        return state
      }

      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      }
    }

    case 'popToast': {
      return {
        ...state,
        toasts: state.toasts.slice(1),
      }
    }

    case 'openPopover': {
      return {
        ...state,
        popover: {
          isOpen: true,
          triggerRef: action.payload.triggerRef,
        },
      }
    }

    case 'closePopover': {
      return {
        ...state,
        popover: {
          isOpen: false,
          triggerRef: undefined,
        },
      }
    }

    default:
      throw new Error(`Action ${type} not implemented`)
  }
}

const initializer = (): State => ({
  cart: false,
  modal: false,
  navbar: false,
  filter: false,
  toasts: [],
  popover: {
    isOpen: false,
    triggerRef: undefined,
  },
})

interface Context extends State {
  closeNavbar: () => void
  openNavbar: () => void
  closeFilter: () => void
  openFilter: () => void
  openCart: () => void
  closeCart: () => void
  openModal: () => void
  closeModal: () => void
  pushToast: (data: Toast) => void
  popToast: () => void
  openPopover: (popover: Popover) => void
  closePopover: () => void
}

const UIContext = createContext<Context | undefined>(undefined)

function UIProvider({ children }: PropsWithChildren<unknown>) {
  const [ui, dispatch] = useReducer(reducer, undefined, initializer)

  const callbacks = useMemo(
    () => ({
      openFilter: () => dispatch({ type: 'open', payload: 'filter' }),
      closeFilter: () => dispatch({ type: 'close', payload: 'filter' }),
      openNavbar: () => dispatch({ type: 'open', payload: 'navbar' }),
      closeNavbar: () => dispatch({ type: 'close', payload: 'navbar' }),
      openCart: () => dispatch({ type: 'open', payload: 'cart' }),
      closeCart: () => dispatch({ type: 'close', payload: 'cart' }),
      openModal: () => dispatch({ type: 'open', payload: 'modal' }),
      closeModal: () => dispatch({ type: 'close', payload: 'modal' }),
      pushToast: (toast: Toast) =>
        dispatch({ type: 'pushToast', payload: toast }),
      popToast: () => dispatch({ type: 'popToast' }),
      openPopover: (popover: Popover) =>
        dispatch({ type: 'openPopover', payload: popover }),
      closePopover: () => dispatch({ type: 'closePopover' }),
    }),
    []
  )

  const value = useMemo(
    () => ({
      ...ui,
      ...callbacks,
    }),
    [callbacks, ui]
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const context = useContext(UIContext)

  if (context === undefined) {
    throw new Error('Missing UI context on React tree')
  }

  return context
}

export default UIProvider
