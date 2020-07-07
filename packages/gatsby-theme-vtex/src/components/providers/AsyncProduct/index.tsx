/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import React, { FC, lazy } from 'react'

import { SuspenseSSR } from '../../SuspenseSSR'
import { Props } from './controler'

const LazyProductProvider = lazy(() => import('./controler'))

export const AsyncProductProvider: FC<Props> = ({ children, syncProduct }) => (
  <SuspenseSSR fallback={<>{children}</>}>
    <LazyProductProvider syncProduct={syncProduct}>
      {children}
    </LazyProductProvider>
  </SuspenseSSR>
)
