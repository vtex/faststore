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
  salesChannel?: string | null
}

export const addToCart = async ({
  orderFormId,
  items,
  salesChannel,
}: AddToCartParams) => {
  const { addToCart: orderForm } = await request<
    AddToCartMutationMutation,
    AddToCartMutationMutationVariables
  >({
    ...AddToCartMutation,
    variables: {
      orderFormId,
      items,
      allowedOutdatedData: ['paymentData'],
      salesChannel,
    },
  })

  setOrderFormId(orderForm.id)

  return orderForm
}

export const mutation = gql`
  mutation AddToCartMutation(
    $orderFormId: ID
    $items: [VTEX_ItemInput]
    $marketingData: VTEX_MarketingDataInput
    $allowedOutdatedData: [String!]
    $salesChannel: String
  ) {
    addToCart(
      orderFormId: $orderFormId
      items: $items
      marketingData: $marketingData
      allowedOutdatedData: $allowedOutdatedData
      salesChannel: $salesChannel
    ) {
      ...OrderFormFragment_orderForm
    }
  }
`
