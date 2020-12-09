/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import React, { createContext, useCallback, useEffect, useState } from 'react'
import type { FC } from 'react'

import { storage } from './storage'
import type { OrderFormFragment_OrderFormFragment } from './controller/__generated__/OrderFormFragment_orderForm.graphql'
import type { OrderFormItem } from './types'

const controler = () => import('./controller')

export type OrderFormContext = {
  value: OrderFormFragment_OrderFormFragment | null
  addToCart: (
    items: OrderFormItem[]
  ) => Promise<OrderFormFragment_OrderFormFragment>
  updateItems: (items: OrderFormItem[], cb: any) => Promise<void>
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

      return ctl.addToCart(id!, items, setOrderForm)
    },
    [id]
  )

  const updateItems = useCallback(
    async (items, cb = () => null) => {
      const ctl = await controler()

      ctl.updateItems({
        orderFormId: id!,
        items,
        callback: (of) => {
          cb(of)
          setOrderForm(of)
        },
      })
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
