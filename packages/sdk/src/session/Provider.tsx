import type { PropsWithChildren } from 'react'
import React from 'react'

import type { Props as RevalidateProps } from './Revalidate'
import { RevalidateProvider } from './Revalidate'
import type { Props as SessionProps } from './Session'
import { SessionProvider } from './Session'

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
