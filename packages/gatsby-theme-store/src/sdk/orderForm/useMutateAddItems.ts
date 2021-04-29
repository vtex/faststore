import { getOrderformId } from './controller/orderForm'
import type { OrderFormFragment_OrderFormFragment as OrderForm } from './controller/__generated__/OrderFormFragment_orderForm.graphql'
import type { AddToCartMutationMutationVariables } from './controller/__generated__/AddToCartMutation.graphql'

const getOrderFormController = () => import('./controller')

const mutationAddItem = async ({
  items,
}: Pick<AddToCartMutationMutationVariables, 'items'>) => {
  const orderFormId = getOrderformId()

  const orderFormController = await getOrderFormController()

  return orderFormController
    .addToCart({ orderFormId, items })
    .then((orderForm: OrderForm) => ({
      data: orderForm,
    }))
}

export const useMutateAddItems = () => {
  return mutationAddItem
}
