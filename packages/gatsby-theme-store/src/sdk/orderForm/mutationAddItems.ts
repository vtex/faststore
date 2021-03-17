import { getOrderformId } from './controller/orderForm'
import type { GraphQLMutationOptions } from '../graphql/typings'
import type { OrderFormFragment_OrderFormFragment } from './controller/__generated__/OrderFormFragment_orderForm.graphql'
import type { AddToCartMutationMutationVariables } from './controller/__generated__/AddToCartMutation.graphql'

const getOrderFormController = () => import('./controller')

export const mutationAddItem = async ({
  variables: { items },
}: GraphQLMutationOptions<AddToCartMutationMutationVariables>) => {
  const id = getOrderformId()

  const orderFormController = await getOrderFormController()

  return orderFormController
    .addToCart(id!, items)
    .then((orderForm: OrderFormFragment_OrderFormFragment) => ({
      data: orderForm,
    }))
}
