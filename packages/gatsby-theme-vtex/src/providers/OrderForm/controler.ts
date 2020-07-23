import { api, OrderForm as OrderFormType } from '@vtex/gatsby-source-vtex'
import PQueue from 'p-queue'

import { postFetcher } from '../../utils/fetcher'
import { OrderFormItem } from './types'
import { storage } from './storage'

type ReactOrderFormStateSetter = (of: OrderFormType) => void

// Queue to make changes to the orderForm
export const queue = new PQueue({
  concurrency: 1,
})

// This queue will be unpaused once we have an orderForm
queue.pause()

export const fetchOrderForm = async (initialOrderForm: OrderFormType | null) =>
  initialOrderForm ?? postFetcher<OrderFormType>(api.checkout.orderForm)

export const setOrderFormState = (
  setReactState: ReactOrderFormStateSetter,
  orderForm: OrderFormType
) => {
  setReactState(orderForm)
  storage.set(orderForm)
}

export const startOrderForm = async (
  orderForm: OrderFormType,
  setReactState: ReactOrderFormStateSetter
) => {
  setOrderFormState(setReactState, orderForm)
  queue.start()
}

export const addItems = async (
  id: string | undefined,
  setOrderForm: ReactOrderFormStateSetter,
  items: OrderFormItem[]
) => {
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

    setOrderFormState(setOrderForm, newOrderForm)
  })
}
