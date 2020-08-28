/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import React, {
  createContext,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { storage } from './storage'
import { OrderFormItem } from './types'
import { OrderFormQueryQuery } from './__generated__/OrderFormQuery.graphql'

type OrderForm = OrderFormQueryQuery['vtex']['orderForm']

const controller = () => import('./controller')

export type OrderFormContext = {
  orderForm: OrderForm | null
  addItems: (items: OrderFormItem[]) => Promise<void>
}

export const OrderForm = createContext<OrderFormContext | undefined>(undefined)

export const OrderFormProvider: FC = ({ children }) => {
  const [orderForm, setOrderForm] = useState<OrderForm | null>(() =>
    storage.get()
  )

  const id = orderForm?.id

  // Fetch orderForm on first render
  useEffect(() => {
    let cancel = false

    const fetchAndDispatch = async () => {
      const { fetchOrderForm, startOrderForm } = await controller()

      const data = await fetchOrderForm(orderForm)

      if (!cancel) {
        startOrderForm(data, setOrderForm)
      }
    }

    fetchAndDispatch()

    return () => {
      cancel = true
    }
  }, [orderForm])

  // Add item to cart using the queue
  const addItems = useCallback(
    async (items) => {
      const ctl = await controller()

      ctl.addItems(id, setOrderForm, items)
    },
    [id]
  )

  return (
    <OrderForm.Provider
      value={{
        orderForm,
        addItems,
      }}
    >
      {children}
    </OrderForm.Provider>
  )
}
