import React, { createContext, useMemo, useReducer } from 'react'
import type { FC, Dispatch } from 'react'

interface Currency {
  code: string // USD
  symbol: string // $
}

interface User {
  id: string // user id
}

interface BaseState {
  locale: string // en-US
  currency: Currency
  country: string // BRA
  channel: string | null
  region: string | null
  priceTable: string | null
  postalCode: string | null
  user: User | null
}

type State = Record<string, any> & BaseState

interface BaseContextValue extends BaseState {
  setLocale: (locale: string) => void
  setCurrency: (currency: Currency) => void
  setCountry: (country: string) => void
  setChannel: (channel: string | null) => void
  setRegion: (region: string | null) => void
  setPriceTable: (table: string | null) => void
  setPostalCode: (postalCode: string | null) => void
  setUser: (user: User) => void
}

export type ContextValue = Record<string, any> & BaseContextValue

type Action =
  | {
      type: 'SET_LOCALE'
      data: string
    }
  | {
      type: 'SET_CURRENCY'
      data: Currency
    }
  | {
      type: 'SET_COUNTRY'
      data: string
    }
  | {
      type: 'SET_CHANNEL'
      data: string | null
    }
  | {
      type: 'SET_REGION'
      data: string | null
    }
  | {
      type: 'SET_PRICE_TABLE'
      data: string | null
    }
  | {
      type: 'SET_POSTAL_CODE'
      data: string | null
    }
  | {
      type: 'SET_USER'
      data: User | null
    }
  | {
      type: string
      data?: any
    }

export const Context = createContext<ContextValue | undefined>(undefined)
Context.displayName = 'StoreSessionContext'

export type Actions = Record<string, (state: State, data?: any) => State>

export type Effects = (
  dispatch: Dispatch<Action>
) => Omit<ContextValue, keyof BaseContextValue>

const baseInitialState: State = {
  currency: {
    code: 'USD',
    symbol: '$',
  },
  country: 'USA',
  locale: 'en',
  postalCode: null,
  priceTable: null,
  channel: null,
  region: null,
  user: null,
}

const reducer = (actions: Actions) => {
  const allActions: Actions = {
    SET_LOCALE: (state, locale) => ({ ...state, locale }),
    SET_CURRENCY: (state, currency) => ({ ...state, currency }),
    SET_COUNTRY: (state, country) => ({ ...state, country }),
    SET_CHANNEL: (state, channel) => ({ ...state, channel }),
    SET_REGION: (state, region) => ({ ...state, region }),
    SET_PRICE_TABLE: (state, table) => ({ ...state, table }),
    SET_POSTAL_CODE: (state, postalCode) => ({ ...state, postalCode }),
    SET_USER: (state, user) => ({ ...state, user }),
    ...actions,
  }

  return (state: State, { type, data }: Action) => {
    const maybeAction = allActions[type]

    if (typeof maybeAction === 'function') {
      return maybeAction(state, data)
    }

    throw new Error('Unknown Session state')
  }
}

export type InitialState = Record<string, any>

interface Props {
  actions?: Actions
  effects?: Effects
  initialState?: InitialState
}

const defaultEffects: Effects = () => ({})

export const Provider: FC<Props> = ({
  children,
  actions = {},
  effects = defaultEffects,
  initialState = {},
}) => {
  const [state, dispatch] = useReducer(reducer(actions), {
    ...baseInitialState,
    ...initialState,
  })

  const value = useMemo(
    () => ({
      ...state,
      ...effects(dispatch),
      setLocale: (locale: string) =>
        dispatch({ type: 'SET_LOCALE', data: locale }),
      setCurrency: (currency: Currency) =>
        dispatch({ type: 'SET_CURRENCY', data: currency }),
      setCountry: (country: string) =>
        dispatch({ type: 'SET_COUNTRY', data: country }),
      setChannel: (channel: string | null) =>
        dispatch({ type: 'SET_CHANNEL', data: channel }),
      setRegion: (region: string | null) =>
        dispatch({ type: 'SET_REGION', data: region }),
      setPriceTable: (table: string | null) =>
        dispatch({ type: 'SET_PRICE_TABLE', data: table }),
      setPostalCode: (postalCode: string | null) =>
        dispatch({ type: 'SET_POSTAL_CODE', data: postalCode }),
      setUser: (user: User) => dispatch({ type: 'SET_USER', data: user }),
    }),
    [effects, state]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
