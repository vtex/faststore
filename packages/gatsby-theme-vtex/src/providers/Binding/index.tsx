/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import React, { FC, lazy } from 'react'

import { SuspenseSSR } from '../../components/SuspenseSSR'

const AsyncBindingProvider = lazy(() => import('./controler'))

export const BindingProvider: FC = ({ children }) => (
  <SuspenseSSR fallback={<>{children}</>}>
    <AsyncBindingProvider>{children}</AsyncBindingProvider>
  </SuspenseSSR>
)
