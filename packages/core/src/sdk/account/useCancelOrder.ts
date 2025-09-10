import { gql } from '../../../@generated'
import type {
  CancelOrderMutationMutation as Mutation,
  CancelOrderMutationMutationVariables as Variables,
} from '../../../@generated/graphql'
import { useLazyQuery } from '../graphql/useLazyQuery'

export const mutation = gql(`
  mutation CancelOrderMutation($data: IUserOrderCancel!) {
    cancelOrder(data: $data) {
      data
    }
  }
`)

export const useCancelOrder = () => {
  const [cancelOrder, { data, error, isValidating: loading }] = useLazyQuery<
    Mutation,
    Variables
  >(mutation, {
    data: {
      orderId: '',
      reason: '',
      customerEmail: '',
    },
  })

  return {
    cancelOrder,
    data,
    error,
    loading,
  }
}
