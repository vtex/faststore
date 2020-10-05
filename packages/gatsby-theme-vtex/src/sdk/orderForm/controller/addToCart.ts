import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { CB, queue, setOrderFormState } from './orderForm'
import {
  AddToCartMutation,
  AddToCartMutationMutation,
  AddToCartMutationMutationVariables,
} from './__generated__/AddToCartMutation.graphql'

export const addToCart = async (id: string, items: Vtex_ItemInput[], cb: CB) =>
  queue.add(async () => {
    const { addToCart: of } = await request<
      AddToCartMutationMutation,
      AddToCartMutationMutationVariables
    >({ ...AddToCartMutation, variables: { id, items } })

    setOrderFormState(of, cb)
  })

export const mutation = gql`
  mutation AddToCartMutation(
    $items: [VTEX_ItemInput]
    $marketingData: VTEX_MarketingDataInput
  ) {
    addToCart(items: $items, marketingData: $marketingData) {
      ...OrderFormFragment_orderForm
    }
  }
`
