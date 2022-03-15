import React, { createContext, useMemo } from 'react'
import type { FC } from 'react'

import { useStorage } from '../storage/useStorage'

export interface Currency {
  code: string // Ex: USD
  symbol: string // Ex: $
}

export interface User {
  id: string // user id
}

export interface Session {
  locale: string // en-US
  currency: Currency
  country: string // BRA
  channel: string | null
  postalCode: string | null
  user: User | null
}

export interface ContextValue extends Session {
  setSession: (session: Partial<Session>) => void
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
  channel: null,
  user: null,
}

interface Props {
  initialState?: Partial<Session>
  namespace?: string
}

export const Provider: FC<Props> = ({
  children,
  initialState,
  namespace = 'main',
}) => {
  const [session, setSession] = useStorage<Session>(
    `${namespace}::store::session`,
    () => ({
      ...baseInitialState,
      ...initialState,
    })
  )

  const value = useMemo<ContextValue>(
    () => ({
      ...session,
      setSession: (data) => setSession({ ...session, ...data }),
    }),
    [session, setSession]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
