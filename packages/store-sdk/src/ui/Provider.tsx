import React, { createContext, useMemo, useReducer } from 'react'
import type { PropsWithChildren } from 'react'

export interface State {
  displayMinicart: boolean
}

export interface Value extends State {
  openMinicart: () => void
  closeMinicart: () => void
}

type Action =
  | {
      type: 'OPEN_MINICART'
    }
  | {
      type: 'CLOSE_MINICART'
    }

export const Context = createContext<Value | undefined>(undefined)
Context.displayName = 'UIContext'

const defaultInitialState: State = {
  displayMinicart: true,
}

const defaultReducer = <S extends State, A extends Action>(
  state: S,
  action: A
): S => {
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

interface Props<S extends State, A extends Action> {
  reducer: (state: S, aciton: A) => S
  initialState: S
}

export const Provider = <S extends State = State, A extends Action = Action>({
  children,
  reducer = defaultReducer,
  initialState = defaultInitialState as S,
}: PropsWithChildren<Props<S, A>>) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const openMinicart = () => dispatch({ type: 'OPEN_MINICART' } as A)
  const closeMinicart = () => dispatch({ type: 'CLOSE_MINICART' } as A)

  const value = useMemo(
    () => ({
      ...state,
      openMinicart,
      closeMinicart,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
