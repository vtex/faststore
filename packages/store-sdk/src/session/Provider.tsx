import React, { createContext, useMemo } from 'react'
import type { FC } from 'react'

import { useLocalStorage } from '../storage/useLocalStorage'

export interface Currency {
  code: string // USD
  symbol: string // $
}

export interface User {
  id: string // user id
}

interface Session {
  locale: string // en-US
  currency: Currency
  country: string // BRA
  channel: string | null
  region: string | null
  priceTable: string | null
  postalCode: string | null
  user: User | null
}

export interface ContextValue extends Session {
  setSession: (session: Session) => void
}

export const Context = createContext<ContextValue | undefined>(undefined)
Context.displayName = 'StoreSessionContext'

const baseInitialState: Session = {
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

export type InitialState = Record<string, any>

interface Props {
  initialState?: Session
  namespace?: string
}

export const Provider: FC<Props> = ({
  children,
  initialState,
  namespace = 'main',
}) => {
  const [session, setSession] = useLocalStorage<Session>(
    `${namespace}::store::session`,
    () => ({
      ...baseInitialState,
      ...initialState,
    })
  )

  const value = useMemo(
    () => ({
      ...session,
      setSession: (data: Session) => setSession({ ...session, ...data }),
    }),
    [session, setSession]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
