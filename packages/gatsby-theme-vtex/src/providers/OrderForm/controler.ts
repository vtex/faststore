import { api, OrderForm as OrderFormType } from '@vtex/gatsby-source-vtex'
import PQueue from 'p-queue'

import { postFetcher } from '../../utils/fetcher'
import { OrderFormItem } from './types'

// Queue to make changes to the orderForm
const queue = new PQueue({
  concurrency: 1,
})

// This queue will be unpaused once we have an orderForm
queue.pause()

export const fetchOrderFormOnce = async (
  setOrderForm: (of: OrderFormType) => void
) => {
  const data = await postFetcher<OrderFormType>(api.checkout.orderForm)

  setOrderForm(data)
  queue.start()
}

export const addItems = async (
  id: string | undefined,
  setOrderForm: (of: OrderFormType) => void,
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

    setOrderForm(newOrderForm)
  })
}
