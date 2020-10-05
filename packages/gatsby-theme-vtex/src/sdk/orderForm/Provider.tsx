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
}

export const OrderForm = createContext<OrderFormContext>(undefined as any)

export const OrderFormProvider: FC = ({ children }) => {
  const [
    orderForm,
    setOrderForm,
  ] = useState<OrderFormFragment_OrderFormFragment | null>(() => storage.get())

  const id = orderForm?.id

  // Fetch orderForm on first render
  useEffect(() => {
    let cancel = false

    controler().then(({ getOrderForm }) =>
      getOrderForm(id, (of) => {
        if (!cancel) {
          setOrderForm(of)
        }
      })
    )

    return () => {
      cancel = true
    }
  }, [id])

  // Add item to cart using the queue
  const addToCart = useCallback(
    async (items) => {
      const ctl = await controler()

      ctl.addToCart(id!, items, setOrderForm)
    },
    [id]
  )

  return (
    <OrderForm.Provider
      value={{
        value: orderForm,
        addToCart,
      }}
    >
      {children}
    </OrderForm.Provider>
  )
}
