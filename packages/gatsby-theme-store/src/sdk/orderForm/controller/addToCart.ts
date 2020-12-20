import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { AddToCartMutation } from './__generated__/AddToCartMutation.graphql'
import { queue, setOrderFormId } from './index'
import type {
  AddToCartMutationMutation,
  AddToCartMutationMutationVariables,
} from './__generated__/AddToCartMutation.graphql'

export const addToCart = async (orderFormId: string, items: Vtex_ItemInput[]) =>
  queue().add(async () => {
    const { addToCart: of } = await request<
      AddToCartMutationMutation,
      AddToCartMutationMutationVariables
    >({ ...AddToCartMutation, variables: { orderFormId, items } })

    setOrderFormId(of.id)

    return of
  })

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
