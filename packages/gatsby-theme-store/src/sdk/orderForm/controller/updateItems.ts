import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { UpdateItemsMutation } from './__generated__/UpdateItemsMutation.graphql'
import { setOrderFormId } from './orderForm'
import type {
  UpdateItemsMutationMutation,
  UpdateItemsMutationMutationVariables,
} from './__generated__/UpdateItemsMutation.graphql'

export const updateItems = async ({
  orderFormId,
  items,
  splitItem,
  allowedOutdatedData,
}: UpdateItemsMutationMutationVariables) => {
  const { updateItems: orderForm } = await request<
    UpdateItemsMutationMutation,
    UpdateItemsMutationMutationVariables
  >({
    ...UpdateItemsMutation,
    variables: { orderFormId, items, splitItem, allowedOutdatedData },
  })

  setOrderFormId(orderForm.id)

  return orderForm
}

export const mutation = gql`
  mutation UpdateItemsMutation(
    $orderFormId: ID
    $items: [VTEX_ItemInput]
    $splitItem: Boolean
    $allowedOutdatedData: [String!]
  ) {
    updateItems(
      orderFormId: $orderFormId
      orderItems: $items
      splitItem: $splitItem
      allowedOutdatedData: $allowedOutdatedData
    ) {
      ...OrderFormFragment_orderForm
    }
  }
`
