import React from 'react'
import type { PropsWithChildren } from 'react'

import { SessionProvider } from './Session'
import { RevalidateProvider } from './Revalidate'
import type { Props as SessionProps } from './Session'
import type { Props as RevalidateProps } from './Revalidate'

interface Props extends SessionProps, RevalidateProps {}

export const Provider = ({
  children,
  onValidateSession,
  initialState,
}: PropsWithChildren<Props>) => {
  return (
    <SessionProvider initialState={initialState}>
      <RevalidateProvider onValidateSession={onValidateSession}>
        {children}
      </RevalidateProvider>
    </SessionProvider>
  )
}
