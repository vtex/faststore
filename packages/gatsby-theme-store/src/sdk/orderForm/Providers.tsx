import React from 'react'
import type { FC } from 'react'
import { OrderQueueProvider } from '@vtex/order-manager/src/OrderQueue'

import { OrderFormProvider, useFetchOrderForm } from './Provider2'

export const OrderFormProviders: FC = ({ children }) => {
  return (
    <OrderQueueProvider>
      <OrderFormProvider getOrderForm={useFetchOrderForm}>
        {children}
      </OrderFormProvider>
    </OrderQueueProvider>
  )
}

// TODO: substitute the order form provider here /packages/gatsby-theme-store/src/gatsby-browser.tsx
