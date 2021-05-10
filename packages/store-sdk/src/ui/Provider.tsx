import React, { createContext, useMemo, useReducer } from 'react'
import type { FC } from 'react'

export interface State {
  displayMinicart: boolean
}

export interface Value extends State {
  openMinicart: () => void
  closeMinicart: () => void
}

export type Action =
  | {
      type: 'OPEN_MINICART'
    }
  | {
      type: 'CLOSE_MINICART'
    }

export const Context = createContext<Value | undefined>(undefined)
Context.displayName = 'UIContext'

const initialState: State = {
  displayMinicart: false,
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'OPEN_MINICART': {
      return {
        ...state,
        displayMinicart: true,
      }
    }

    case 'CLOSE_MINICART': {
      return {
        ...state,
        displayMinicart: false,
      }
    }

    default: {
      throw new Error('Unknown UI state')
    }
  }
}

export const Provider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const openMinicart = () => dispatch({ type: 'OPEN_MINICART' })
  const closeMinicart = () => dispatch({ type: 'CLOSE_MINICART' })

  const value = useMemo(
    () => ({
      ...state,
      openMinicart,
      closeMinicart,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  )

  console.warn('[store-sdk]: UIPROVIDER')

  return <Context.Provider value={value}>{children}</Context.Provider>
}
