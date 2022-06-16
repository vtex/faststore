import { createContext, useContext, useMemo, useReducer } from 'react'
import type { PropsWithChildren } from 'react'

interface Toast {
  message: string
  status: 'ERROR' | 'WARNING' | 'INFO'
  title?: string
  icon?: string
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
  toasts: Toast[]
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
}

const UIContext = createContext<Context | undefined>(undefined)

function UIProvider({ children }: PropsWithChildren) {
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
