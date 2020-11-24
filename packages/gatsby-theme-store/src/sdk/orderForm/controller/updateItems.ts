import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { CB, queue, setOrderFormState } from './orderForm'
import {
  UpdateItemsMutation,
  UpdateItemsMutationMutation,
  UpdateItemsMutationMutationVariables,
} from './__generated__/UpdateItemsMutation.graphql'

type UpdateItemsResolver = (args: {
  orderFormId: string
  items: Vtex_ItemInput[]
  splitItem?: boolean
  callback: CB
}) => void

export const updateItems: UpdateItemsResolver = async ({
  orderFormId,
  items,
  splitItem,
  callback,
}) =>
  queue.add(async () => {
    const { updateItems: of } = await request<
      UpdateItemsMutationMutation,
      UpdateItemsMutationMutationVariables
    >({
      ...UpdateItemsMutation,
      variables: { orderFormId, items, splitItem },
    })

    setOrderFormState(of, callback)
  })

export const mutation = gql`
  mutation UpdateItemsMutation(
    $orderFormId: ID
    $items: [VTEX_ItemInput]
    $splitItem: Boolean
  ) {
    updateItems(
      orderFormId: $orderFormId
      orderItems: $items
      splitItem: $splitItem
    ) {
      ...OrderFormFragment_orderForm
    }
  }
`
