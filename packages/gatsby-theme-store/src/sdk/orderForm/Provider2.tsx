// TODO: rename this file to Provider
import { useState, useEffect } from 'react'

import type { getOrderForm as getOrderFormType } from './controller'
import type { OrderFormFragment_OrderFormFragment as OrderForm } from './controller/__generated__/OrderFormFragment_orderForm.graphql'

let controller: {
  getOrderForm: typeof getOrderFormType
} | null = null

const getController = async () => {
  if (!controller) {
    controller = await import('./controller')
  }

  return controller
}

export const useFetchOrderForm = () => {
  const [orderForm, setOrderForm] = useState<OrderForm>()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    getController().then((localController) => {
      localController
        .getOrderForm()
        .then((newOrderForm) => {
          setOrderForm(newOrderForm)
          setLoading(false)
        })
        .catch(setError)
    })
  }, [])

  return { data: orderForm ? { orderForm } : undefined, loading, error }
}

export type { OrderFormFragment_OrderFormFragment as OrderForm } from './controller/__generated__/OrderFormFragment_orderForm.graphql'
export {
  OrderFormProvider,
  useOrderForm,
} from '@vtex/order-manager/src/OrderForm'
