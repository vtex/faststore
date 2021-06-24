import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { AddToCartMutation } from './__generated__/AddToCartMutation.graphql'
import { setOrderFormId } from './orderForm'
import type {
  AddToCartMutationMutation,
  AddToCartMutationMutationVariables,
} from './__generated__/AddToCartMutation.graphql'

interface AddToCartParams {
  orderFormId?: string | null
  items: AddToCartMutationMutationVariables['items']
  marketingData?: AddToCartMutationMutationVariables['marketingData']
}

export const addToCart = async ({ orderFormId, items }: AddToCartParams) => {
  const { addToCart: orderForm } = await request<
    AddToCartMutationMutation,
    AddToCartMutationMutationVariables
  >({
    ...AddToCartMutation,
    variables: { orderFormId, items, allowedOutdatedData: ['paymentData'] },
  })

  setOrderFormId(orderForm.id)

  return orderForm
}

export const mutation = gql`
  mutation AddToCartMutation(
    $orderFormId: ID
    $items: [StoreItemInput]
    $marketingData: StoreMarketingDataInput
    $allowedOutdatedData: [String!]
  ) {
    addToCart(
      orderFormId: $orderFormId
      items: $items
      marketingData: $marketingData
      allowedOutdatedData: $allowedOutdatedData
    ) {
      ...OrderFormFragment_orderForm
    }
  }
`
