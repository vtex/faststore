import type { Dispatch, PropsWithChildren } from 'react'
import React, { createContext, useMemo, useReducer } from 'react'

interface BaseState {
  displayMinicart: boolean
}

type State = Record<string, any> & BaseState

export interface BaseContextValue extends BaseState {
  openMinicart: () => void
  closeMinicart: () => void
}

export type ContextValue = Record<string, any> & BaseContextValue

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

export type Actions = Record<string, (state: State, data?: any) => State>

export type Effects = (
  dispatch: Dispatch<Action>
) => Omit<ContextValue, keyof BaseContextValue>

const baseInitialState: State = {
  displayMinicart: false,
}

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

export type InitialState = Record<string, any>

interface Props {
  actions?: Actions
  effects?: Effects
  initialState?: InitialState
}

const defaultEffects: Effects = () => ({})

export const Provider = ({
  children,
  actions = {},
  effects = defaultEffects,
  initialState = {},
}: PropsWithChildren<Props>) => {
  const [state, dispatch] = useReducer(reducer(actions), {
    ...baseInitialState,
    ...initialState,
  })

  const effectsValue = useMemo(
    () => ({
      ...effects(dispatch),
      openMinicart: () => dispatch({ type: 'OPEN_MINICART' }),
      closeMinicart: () => dispatch({ type: 'CLOSE_MINICART' }),
    }),
    [effects]
  )

  const value = useMemo(
    () => ({
      ...state,
      ...effectsValue,
    }),
    [effectsValue, state]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
