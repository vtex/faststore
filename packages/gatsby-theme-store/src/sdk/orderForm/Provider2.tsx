// TODO: rename this file to Provider
import { useState, useEffect } from 'react'
import type { OrderForm } from '@vtex/order-manager/src/OrderForm'

import type { getOrderForm as getOrderFormType } from './controller'

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
  const [orderForm, setOrderForm] = useState<Exclude<OrderForm, '__typename'>>()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    getController().then((localController) => {
      localController
        .getOrderForm()
        .then((newOrderForm) => {
          setOrderForm((newOrderForm as unknown) as OrderForm)
          setLoading(false)
        })
        .catch(setError)
    })
  }, [])

  return { data: orderForm ? { orderForm } : undefined, loading, error }
}

export {
  OrderFormProvider,
  useOrderForm,
} from '@vtex/order-manager/src/OrderForm'
