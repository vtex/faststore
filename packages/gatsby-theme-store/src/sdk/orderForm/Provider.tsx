/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import React, { createContext, useCallback, useEffect, useState } from 'react'
import type { FC } from 'react'

import type { OrderFormFragment_OrderFormFragment } from './controller/__generated__/OrderFormFragment_orderForm.graphql'
import type { OrderFormItem } from './types'

const controller = () => import('./controller')

export type OrderFormContext = {
  value: OrderFormFragment_OrderFormFragment | null
  addToCart: (items: OrderFormItem[]) => Promise<void>
  updateItems: (items: OrderFormItem[]) => Promise<void>
}

export const OrderForm = createContext<OrderFormContext>(undefined as any)

export const OrderFormProvider: FC = ({ children }) => {
  const [error, setError] = useState<Error | null>(null)
  const [
    orderForm,
    setOrderForm,
  ] = useState<OrderFormFragment_OrderFormFragment | null>(null)

  const id = orderForm?.id

  useEffect(() => {
    if (
      error != null &&
      !window.location.pathname.startsWith('/500') &&
      !window.location.pathname.startsWith('/offline')
    ) {
      throw error
    }
  }, [error])

  // Fetch orderForm on first render
  useEffect(() => {
    let cancel = false

    const cbId = window.requestIdleCallback(async () => {
      try {
        const ctl = await controller()
        const of = await ctl.getOrderForm()

        if (!cancel) {
          setOrderForm(of)
        }
      } catch (e) {
        setError(e)
      }
    })

    return () => {
      cancel = true
      window.cancelIdleCallback(cbId)
    }
  }, [])

  // Add item to cart using the queue
  const addToCart = useCallback(
    async (items) => {
      const ctl = await controller()
      const of = await ctl.addToCart(id!, items)

      setOrderForm(of)
    },
    [id]
  )

  const updateItems = useCallback(
    async (items) => {
      const ctl = await controller()
      const of = await ctl.updateItems({
        orderFormId: id!,
        items,
      })

      setOrderForm(of)
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
