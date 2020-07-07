/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import React, { FC, lazy } from 'react'

import { SuspenseSSR } from '../../SuspenseSSR'
import { Props } from './controler'

const LazyProductsProvider = lazy(() => import('./controler'))

export const AsyncProductsProvider: FC<Props> = ({
  children,
  syncProducts,
  filterOptions,
}) => (
  <SuspenseSSR fallback={<>{children}</>}>
    <LazyProductsProvider
      filterOptions={filterOptions}
      syncProducts={syncProducts}
    >
      {children}
    </LazyProductsProvider>
  </SuspenseSSR>
)
