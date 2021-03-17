import React, { useState, useEffect } from 'react'
import type { FC } from 'react'
import { OrderQueueProvider } from '@vtex/order-manager/src/OrderQueue'
import { OrderItemsProvider } from 'order-items/src/OrderItems'
import { createOrderFormProvider } from '@vtex/order-manager/src/createOrderFormProvider'

import { getOrderformId } from './controller/orderForm'
import { clearOrderFormMessages } from './clearOrderFormMessage'
import { useToast } from './useToast'
import type { getOrderForm, addToCart, updateItems } from './controller'
import type { OrderFormFragment_OrderFormFragment as OrderForm } from './controller/__generated__/OrderFormFragment_orderForm.graphql'
import type { AddToCartMutationMutationVariables } from './controller/__generated__/AddToCartMutation.graphql'
import type { UpdateItemsMutationMutationVariables } from './controller/__generated__/UpdateItemsMutation.graphql'

let controller: {
  addToCart: typeof addToCart
  getOrderForm: typeof getOrderForm
  updateItems: typeof updateItems
} | null = null

const getController = async () => {
  if (!controller) {
    controller = await import('./controller')
  }

  return controller
}

const useGetOrderForm = () => {
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

interface GraphQLMutation<T> {
  variables: T
}

const parseResponseToData = (orderForm: OrderForm) => ({
  data: orderForm,
})

const handleAddItem = async ({
  variables: { items },
}: GraphQLMutation<AddToCartMutationMutationVariables>) => {
  const id = getOrderformId()

  const localController = await getController()

  return localController.addToCart(id!, items).then(parseResponseToData)
}

const handleUpdateQuantity = async ({
  variables: { items },
}: GraphQLMutation<UpdateItemsMutationMutationVariables>) => {
  const id = getOrderformId()

  const localController = await getController()

  return localController
    .updateItems({ orderFormId: id!, items })
    .then(parseResponseToData)
}

const { OrderFormProvider, useOrderForm } = createOrderFormProvider<OrderForm>({
  useGetOrderForm,
  clearOrderFormMessages,
  useToast,
})

export const OrderFormProviders: FC = ({ children }) => {
  return (
    <OrderQueueProvider>
      <OrderFormProvider>
        <OrderItemsProvider
          handleAddItem={handleAddItem}
          handleUpdateQuantity={handleUpdateQuantity}
        >
          {children}
        </OrderItemsProvider>
      </OrderFormProvider>
    </OrderQueueProvider>
  )
}

export { useOrderForm }
// TODO: substitute the order form provider here /packages/gatsby-theme-store/src/gatsby-browser.tsx
