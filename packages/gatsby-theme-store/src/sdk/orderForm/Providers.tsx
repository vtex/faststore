import React from 'react'
import type { FC } from 'react'
import { OrderQueueProvider } from '@vtex/order-manager/src/OrderQueue'
import { OrderItemsProvider } from 'order-items/src/OrderItems'
import { createOrderFormProvider } from '@vtex/order-manager/src/createOrderFormProvider'

import { clearOrderFormMessages } from './clearOrderFormMessage'
import { useToast } from './useToast'
import { useGetOrderForm } from './useGetOrderForm'
import type { OrderFormFragment_OrderFormFragment } from './controller/__generated__/OrderFormFragment_orderForm.graphql'

const {
  OrderFormProvider,
  useOrderForm,
} = createOrderFormProvider<OrderFormFragment_OrderFormFragment>({
  useGetOrderForm,
  clearOrderFormMessages,
  useToast,
})

export const OrderFormProviders: FC = ({ children }) => {
  return (
    <OrderQueueProvider>
      <OrderFormProvider>
        <OrderItemsProvider>
          {children}
        </OrderItemsProvider>
      </OrderFormProvider>
    </OrderQueueProvider>
  )
}

export { useOrderForm }
