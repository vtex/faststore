import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { ClearOrderFormMessagesMutation } from './__generated__/ClearOrderFormMessagesMutation.graphql'
import type {
  ClearOrderFormMessagesMutationMutation,
  ClearOrderFormMessagesMutationMutationVariables,
} from './__generated__/ClearOrderFormMessagesMutation.graphql'

export const clearMessages = async ({
  orderFormId,
}: {
  orderFormId: string
}) => {
  await request<
    ClearOrderFormMessagesMutationMutation,
    ClearOrderFormMessagesMutationMutationVariables
  >({ ...ClearOrderFormMessagesMutation, variables: { orderFormId } })
}

export const mutation = gql`
  mutation ClearOrderFormMessagesMutation($orderFormId: ID) {
    clearOrderFormMessages(orderFormId: $orderFormId) {
      id
    }
  }
`
