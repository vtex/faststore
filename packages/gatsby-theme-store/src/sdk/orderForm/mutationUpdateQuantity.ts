import { getOrderformId } from './controller/orderForm'
import type { GraphQLMutationOptions } from '../graphql/typings'
import type { UpdateItemsMutationMutationVariables } from './controller/__generated__/UpdateItemsMutation.graphql'
import type { OrderFormFragment_OrderFormFragment } from './controller/__generated__/OrderFormFragment_orderForm.graphql'

const getOrderFormController = () => import('./controller')

export const mutationUpdateQuantity = async ({
  variables: { items },
}: GraphQLMutationOptions<UpdateItemsMutationMutationVariables>) => {
  const id = getOrderformId()

  const orderFormController = await getOrderFormController()

  return orderFormController
    .updateItems({ orderFormId: id!, items })
    .then((orderForm: OrderFormFragment_OrderFormFragment) => ({
      data: orderForm,
    }))
}
