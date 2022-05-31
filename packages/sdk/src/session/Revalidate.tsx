import React, { createContext, useMemo } from 'react'
import type { PropsWithChildren } from 'react'

import { useContext } from '../utils/useContext'
import { createUseValidationHook } from '../utils/useValidation'
import { Context as SessionContext } from './Session'
import type { Session } from './Session'

export interface Props {
  onValidateSession?: (session: Session) => Promise<Session | null>
}

export const Context = createContext<boolean | undefined>(undefined)

const useValidation = createUseValidationHook()

export const RevalidateProvider = ({
  onValidateSession,
  children,
}: PropsWithChildren<Props>) => {
  const context = useContext(SessionContext)
  const session = useMemo(() => {
    const { setSession, ...rest } = context

    return rest
  }, [context])

  const isValidating = useValidation({
    onValidate: onValidateSession,
    value: session,
    setValue: context.setSession,
  })

  return <Context.Provider value={isValidating}>{children}</Context.Provider>
}
