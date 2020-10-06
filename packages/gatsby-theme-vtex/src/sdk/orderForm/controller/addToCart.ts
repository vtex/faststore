import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { CB, queue, setOrderFormState } from './orderForm'
import {
  AddToCartMutation,
  AddToCartMutationMutation,
  AddToCartMutationMutationVariables,
} from './__generated__/AddToCartMutation.graphql'

export const addToCart = async (
  orderFormId: string,
  items: Vtex_ItemInput[],
  cb: CB
) =>
  queue.add(async () => {
    const { addToCart: of } = await request<
      AddToCartMutationMutation,
      AddToCartMutationMutationVariables
    >({ ...AddToCartMutation, variables: { orderFormId, items } })

    setOrderFormState(of, cb)
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
