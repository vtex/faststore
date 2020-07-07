/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import { OrderForm as OrderFormType } from '@vtex/gatsby-source-vtex'
import React, { createContext, FC, lazy } from 'react'
import { DataOrModifiedFn } from 'use-async-resource'

import { SuspenseSSR } from '../../SuspenseSSR'

const AsyncOrderFormProvider = lazy(() => import('./manager'))

interface OrderFormItem {
  id: number
  quantity: number
  seller: number
}

type OrderFormContext = {
  orderForm: OrderFormType | null
  setOrderForm: (of: OrderFormType) => void
  fetchOrderForm: DataOrModifiedFn<OrderFormType>
  addItems: (item: OrderFormItem[]) => void
}

const OrderForm = createContext<OrderFormContext | null>(null as any)

export const OrderFormProvider: FC = ({ children }) => {
  const fallback = (
    <OrderForm.Provider value={null}>{children}</OrderForm.Provider>
  )
  return (
    <SuspenseSSR fallback={fallback}>
      <AsyncOrderFormProvider>{children}</AsyncOrderFormProvider>
    </SuspenseSSR>
  )
}
