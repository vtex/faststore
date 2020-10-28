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

import { OrderFormFragment_OrderFormFragment } from './controller/__generated__/OrderFormFragment_orderForm.graphql'
import { storage } from './storage'
import { OrderFormItem } from './types'

const controler = () => import('./controller')

export type OrderFormContext = {
  value: OrderFormFragment_OrderFormFragment | null
  addToCart: (items: OrderFormItem[]) => Promise<void>
  updateItems: (items: OrderFormItem[]) => Promise<void>
}

export const OrderForm = createContext<OrderFormContext>(undefined as any)

export const OrderFormProvider: FC = ({ children }) => {
  const [orderForm, setOrderForm] = useState(() => storage.get())

  const id = orderForm?.id

  // Fetch orderForm on first render
  useEffect(() => {
    let cancel = false

    const callbackId = window.requestIdleCallback(() => {
      controler().then(({ getOrderForm }) =>
        getOrderForm(id, (of) => {
          if (!cancel) {
            setOrderForm(of)
          }
        })
      )
    })

    return () => {
      cancel = true
      window.cancelIdleCallback(callbackId)
    }
  }, [id])

  // Add item to cart using the queue
  const addToCart = useCallback(
    async (items) => {
      const ctl = await controler()

      await ctl.addToCart(id!, items, setOrderForm)
    },
    [id]
  )

  const updateItems = useCallback(
    async (items) => {
      const ctl = await controler()

      await ctl.updateItems({ orderFormId: id!, items, callback: setOrderForm })
    },
    [id]
  )

  return (
    <OrderForm.Provider
      value={{
        value: orderForm,
        addToCart,
        updateItems,
      }}
    >
      {children}
    </OrderForm.Provider>
  )
}
