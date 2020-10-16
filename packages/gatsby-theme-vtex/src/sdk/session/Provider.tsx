import React, { createContext, FC, useCallback, useState } from 'react'

import {
  clear as clearSession,
  create as createSession,
  patch as patchSession,
} from './controller'
import { storage } from './storage'
import { Session } from './types'

export type Action =
  | { type: 'create' }
  | { type: 'clear' }
  | { type: 'patch'; data: any }

export interface SessionContext {
  value: Session | null
  dispatch: (action: Action) => Promise<void>
}

export const Context = createContext<SessionContext | undefined>(undefined)

export const SessionProvider: FC = ({ children }) => {
  const [session, setSession] = useState(() => storage.get())

  const dispatch = useCallback(async (action: Action) => {
    let newSession = null

    if (action.type === 'create') {
      newSession = await createSession()
    }

    if (action.type === 'clear') {
      await clearSession()
    }

    // eslint-disable-next-line vtex/prefer-early-return
    if (action.type === 'patch') {
      newSession = await patchSession(action.data)
    }

    storage.set(newSession)
    setSession(newSession)
  }, [])

  return (
    <Context.Provider value={{ value: session, dispatch }}>
      {children}
    </Context.Provider>
  )
}
