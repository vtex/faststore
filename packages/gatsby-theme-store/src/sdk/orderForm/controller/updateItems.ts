import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { UpdateItemsMutation } from './__generated__/UpdateItemsMutation.graphql'
import { queue, setOrderFormId } from './orderForm'
import type {
  UpdateItemsMutationMutation,
  UpdateItemsMutationMutationVariables,
} from './__generated__/UpdateItemsMutation.graphql'

interface Options {
  orderFormId: string
  items: Vtex_ItemInput[]
  splitItem?: boolean
  allowOutdatedData?: UpdateItemsMutationMutationVariables['allowOutdatedData']
}

export const updateItems = async ({ orderFormId, items, splitItem, allowOutdatedData }: Options) =>
  queue().add(async () => {
    const { updateItems: of } = await request<
      UpdateItemsMutationMutation,
      UpdateItemsMutationMutationVariables
    >({
      ...UpdateItemsMutation,
      variables: { orderFormId, items, splitItem, allowOutdatedData },
    })

    setOrderFormId(of.id)

    return of
  })

export const mutation = gql`
  mutation UpdateItemsMutation(
    $orderFormId: ID
    $items: [VTEX_ItemInput]
    $splitItem: Boolean
    $allowOutdatedData: [String!]
  ) {
    updateItems(
      orderFormId: $orderFormId
      orderItems: $items
      splitItem: $splitItem
      allowOutdatedData: $allowOutdatedData
    ) {
      ...OrderFormFragment_orderForm
    }
  }
`
