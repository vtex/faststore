import { gql } from '@generated'
import type {
  CancelOrderMutationMutation as Mutation,
  CancelOrderMutationMutationVariables as Variables,
} from '../../../@generated/graphql'
import { useLazyQuery } from '../graphql/useLazyQuery'

export const mutation = gql(`
  mutation CancelOrderMutation($orderId: String!) {
    cancelOrder(orderId: $orderId) {
      date
      orderId
      receipt
    }
  }
`)

export const useCancelOrder = () => {
  const [cancelOrder, { data, error, isValidating: loading }] = useLazyQuery<
    Mutation,
    Variables
  >(mutation, {
    orderId: '',
  })

  return {
    cancelOrder,
    data,
    error,
    loading,
  }
}
