import React, { createContext, useMemo, useReducer } from 'react'
import type { FC, Dispatch } from 'react'

interface BaseState {
  displayMinicart: boolean
}

interface BaseContextValue extends BaseState {
  openMinicart: () => void
  closeMinicart: () => void
}

type State = Record<string, any> & BaseState

type ContextValue = Record<string, any> & BaseContextValue

type Action =
  | {
      type: 'OPEN_MINICART'
      data: undefined
    }
  | {
      type: 'CLOSE_MINICART'
      data: undefined
    }
  | {
      type: string
      data?: any
    }

export const Context = createContext<ContextValue | undefined>(undefined)
Context.displayName = 'UIContext'

const initialState: State = {
  displayMinicart: false,
}

export type Actions = Record<string, (state: State, data?: any) => State>

export type Effects = (
  dispatch: Dispatch<Action>
) => Omit<ContextValue, keyof BaseContextValue>

export type InitFunction = (initial: State) => State

const reducer = (actions: Actions) => {
  const allActions: Actions = {
    OPEN_MINICART: (state) => ({
      ...state,
      displayMinicart: true,
    }),
    CLOSE_MINICART: (state) => ({
      ...state,
      displayMinicart: false,
    }),
    ...actions,
  }

  return (state: State, { type, data }: Action) => {
    const maybeAction = allActions[type]

    if (typeof maybeAction === 'function') {
      return maybeAction(state, data)
    }

    throw new Error('Unknown UI state')
  }
}

interface Props {
  actions?: Actions
  effects?: Effects
  init?: InitFunction
}

const defaultInitializer = <T,>(x: T) => x
const defaultEffects: Effects = () => ({})

export const Provider: FC<Props> = ({
  children,
  actions = {},
  effects = defaultEffects,
  init = defaultInitializer,
}) => {
  const [state, dispatch] = useReducer(reducer(actions), initialState, init)

  const value = useMemo(
    () => ({
      ...state,
      ...effects(dispatch),
      openMinicart: () => dispatch({ type: 'OPEN_MINICART' }),
      closeMinicart: () => dispatch({ type: 'CLOSE_MINICART' }),
    }),
    [effects, state]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
