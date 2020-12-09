import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { AddToCartMutation } from './__generated__/AddToCartMutation.graphql'
import { queue, setOrderFormState } from './orderForm'
import type { CB } from './orderForm'
import type {
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
