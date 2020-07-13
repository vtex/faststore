/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import React, { FC, lazy } from 'react'

import { SuspenseSSR } from '../../components/SuspenseSSR'

const AsyncOrderFormProvider = lazy(() => import('./controler'))

const OrderFormProvider: FC = ({ children }) => (
  <SuspenseSSR fallback={<>{children}</>}>
    <AsyncOrderFormProvider>{children}</AsyncOrderFormProvider>
  </SuspenseSSR>
)

export default OrderFormProvider
