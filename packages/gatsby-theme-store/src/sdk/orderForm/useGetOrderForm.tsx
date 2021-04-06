import { useState, useEffect, useMemo } from 'react'

import type { OrderFormFragment_OrderFormFragment } from './controller/__generated__/OrderFormFragment_orderForm.graphql'

const getOrderFormController = () => import('./controller')

export const useGetOrderForm = () => {
  const [
    orderForm,
    setOrderForm,
  ] = useState<OrderFormFragment_OrderFormFragment>()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    getOrderFormController().then((localController) => {
      localController
        .getOrderForm()
        .then((newOrderForm) => {
          setOrderForm(newOrderForm)
          setLoading(false)
        })
        .catch((err) => {
          setError(err)
          setLoading(false)
        })
    })
  }, [])

  const result = useMemo(
    () => ({ data: orderForm ? { orderForm } : undefined, loading, error }),
    [error, loading, orderForm]
  )

  return result
}
