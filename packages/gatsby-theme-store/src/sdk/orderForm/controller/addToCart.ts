import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { AddToCartMutation } from './__generated__/AddToCartMutation.graphql'
import { queue, setOrderFormId } from './orderForm'
import type {
  AddToCartMutationMutation,
  AddToCartMutationMutationVariables,
} from './__generated__/AddToCartMutation.graphql'

interface AddToCartParams {
  orderFormId?: string | null
  items: AddToCartMutationMutationVariables['items']
  marketingData?: AddToCartMutationMutationVariables['marketingData']
  allowOutdatedData?: AddToCartMutationMutationVariables['allowOutdatedData']
}

export const addToCart = async ({ orderFormId, items, allowOutdatedData }: AddToCartParams) =>
  queue().add(async () => {
    const { addToCart: of } = await request<
      AddToCartMutationMutation,
      AddToCartMutationMutationVariables
    >({ ...AddToCartMutation, variables: { orderFormId, items, allowOutdatedData } })

    setOrderFormId(of.id)

    return of
  })

export const mutation = gql`
  mutation AddToCartMutation(
    $orderFormId: ID
    $items: [VTEX_ItemInput]
    $marketingData: VTEX_MarketingDataInput
    $allowOutdatedData: [String!]
  ) {
    addToCart(
      orderFormId: $orderFormId
      items: $items
      marketingData: $marketingData
      allowOutdatedData: $allowOutdatedData
    ) {
      ...OrderFormFragment_orderForm
    }
  }
`
