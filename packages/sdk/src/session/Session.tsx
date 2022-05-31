import React, { createContext, useMemo } from 'react'
import type { PropsWithChildren } from 'react'

import { useStorage } from '../storage/useStorage'

export interface Currency {
  code: string // Ex: USD
  symbol: string // Ex: $
}

export interface Person {
  id: string
  email: string
  givenName: string
  familyName: string
}

export interface Session {
  locale: string // en-US
  currency: Currency
  country: string // BRA
  channel: string | null
  postalCode: string | null
  person: Person | null
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
  person: null,
}

export interface Props {
  initialState?: Partial<Session>
  namespace?: string
}

export const SessionProvider = ({
  children,
  initialState,
  namespace = 'main',
}: PropsWithChildren<Props>) => {
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
