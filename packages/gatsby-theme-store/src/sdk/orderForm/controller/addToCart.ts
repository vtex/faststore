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
  const { addToCart: of } = await request<
    AddToCartMutationMutation,
    AddToCartMutationMutationVariables
  >({ ...AddToCartMutation, variables: { orderFormId, items } })

  setOrderFormId(of.id)

  return of
}

export const mutation = gql`
  mutation AddToCartMutation(
    $orderFormId: ID
    $items: [VTEX_ItemInput]
    $marketingData: VTEX_MarketingDataInput
  ) {
    addToCart(
      orderFormId: $orderFormId
      items: $items
      marketingData: $marketingData
    ) {
      ...OrderFormFragment_orderForm
    }
  }
`
