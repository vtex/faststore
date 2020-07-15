import { api, OrderForm as OrderFormType } from '@vtex/gatsby-source-vtex'
import React, {
  createContext,
  FC,
  useContext,
  useState,
  useMemo,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
import PQueue from 'p-queue'

import { postFetcher } from '../../utils/fetcher'
import { OrderFormItem } from './types'

// Queue to make changes to the orderForm
const queue = new PQueue({
  concurrency: 1,
})

// This queue will be unpaused once we have an orderForm
queue.pause()

type OrderFormContext = {
  value: OrderFormType | null
  setOrderForm: Dispatch<SetStateAction<OrderFormType | null>>
  addItems: (items: OrderFormItem[]) => Promise<void>
}

const OrderForm = createContext<OrderFormContext | null>(null)

const OrderFormProvider: FC = ({ children }) => {
  const [orderForm, setOrderForm] = useState<OrderFormType | null>(null)
  const id = orderForm?.orderFormId

  // Fetch orderForm on first render
  useEffect(() => {
    ;(async () => {
      const data = await postFetcher<OrderFormType>(api.checkout.orderForm)

      setOrderForm(data)
      queue.start()
    })()
  }, [])

  // Add item to cart using the queue
  const addItems = useMemo(
    (): OrderFormContext['addItems'] => (items) => {
      if (!id) {
        throw new Error('This page does not have an orderForm yet')
      }

      return queue.add(async () => {
        const newOrderForm = await postFetcher<OrderFormType>(
          api.checkout.addItem(id),
          {
            body: JSON.stringify({ orderItems: items }),
          }
        )

        setOrderForm(newOrderForm)
      })
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

export const useOrderForm = (): OrderFormContext | null => {
  return useContext(OrderForm)
}

export default OrderFormProvider
