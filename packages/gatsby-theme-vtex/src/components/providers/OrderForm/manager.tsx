/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import { api, OrderForm as OrderFormType } from '@vtex/gatsby-source-vtex'
import React, { createContext, FC, useContext, useState, useMemo } from 'react'
import { DataOrModifiedFn, useAsyncResource } from 'use-async-resource'

const fetchJSON = async <T extends any>(url: string, init?: RequestInit) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      ...init?.headers,
    },
    ...init,
  })
  return response.json() as Promise<T>
}

const orderFormFetch = async () =>
  fetchJSON<OrderFormType>(api.checkout.orderForm)

const addItemFetch = async (id: string, items: any[]) =>
  fetchJSON<OrderFormType>(api.checkout.addItem(id), {
    body: JSON.stringify({ orderItems: items }),
  })

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

const OrderForm = createContext<OrderFormContext | null>(null)

const createAddItems = (
  ofId: string | undefined,
  setOrderForm: (of: OrderFormType) => void
) => async (items: any[]) => {
  if (!ofId) {
    throw new Error('OrderForm Not Found')
  }
  const orderForm = await addItemFetch(ofId, items)
  setOrderForm(orderForm)
}

const OrderFormProvider: FC = ({ children }) => {
  const [orderForm, setOrderForm] = useState<OrderFormType | null>(null)
  const [fetchOrderForm] = useAsyncResource(orderFormFetch, [])
  const ofId = orderForm?.orderFormId

  const addItems = useMemo(() => createAddItems(ofId, setOrderForm), [ofId])

  return (
    <OrderForm.Provider
      value={{
        orderForm,
        setOrderForm,
        fetchOrderForm,
        addItems,
      }}
    >
      {children}
    </OrderForm.Provider>
  )
}

type FetchedOrderFormContext = OrderFormContext & {
  orderForm: OrderFormType
}

export const useOrderForm = (): FetchedOrderFormContext => {
  const ctx = useContext(OrderForm)

  if (!ctx) {
    throw new Error('Something went wrong')
  }

  const { orderForm, fetchOrderForm, setOrderForm } = ctx

  // If no orderForm was fetched yet, Suspend
  // untill fetched and return the new orderForm
  if (orderForm == null) {
    const of = fetchOrderForm()
    setOrderForm(of)
    return {
      ...ctx,
      orderForm: of,
    }
  }

  return ctx as FetchedOrderFormContext
}

export default OrderFormProvider
