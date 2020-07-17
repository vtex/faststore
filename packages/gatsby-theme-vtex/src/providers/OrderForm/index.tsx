/**
 * This provider starts fetching early and adds a suspendable reader to
 * the context. Use the hooks to interact with the context
 */
import { OrderForm as OrderFormType } from '@vtex/gatsby-source-vtex'
import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import { OrderFormItem } from './types'

type OrderFormContext = {
  value: OrderFormType | null
  setOrderForm: Dispatch<SetStateAction<OrderFormType | null>>
  addItems: (items: OrderFormItem[]) => Promise<void>
}

const controler = () => import('./controler')

const OrderForm = createContext<OrderFormContext | null>(null)

const OrderFormProvider: FC = ({ children }) => {
  const [orderForm, setOrderForm] = useState<OrderFormType | null>(null)
  const id = orderForm?.orderFormId

  // Fetch orderForm on first render
  useEffect(() => {
    ;(async () => {
      const ctl = await controler()

      ctl.fetchOrderFormOnce(setOrderForm)
    })()
  }, [])

  // Add item to cart using the queue
  const addItems = useCallback(
    async (items) => {
      const ctl = await controler()

      ctl.addItems(id, setOrderForm, items)
    },
    [id]
  )

  return (
    <OrderForm.Provider
      value={{
        value: orderForm,
        setOrderForm,
        addItems,
      }}
    >
      {children}
    </OrderForm.Provider>
  )
}

export const useOrderForm = (): OrderFormContext => {
  const ctx = useContext(OrderForm)

  if (!ctx) {
    throw new Error(
      'useOrderForm needs to have an OrderFormProvider previously in the React tree'
    )
  }

  return ctx
}

export default OrderFormProvider
