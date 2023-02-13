import { gql } from '@faststore/graphql-utils'

import type {
  SubscribeToNewsletterMutation as Mutation,
  SubscribeToNewsletterMutationVariables as Variables,
} from '../../../@generated/graphql/index'
import { useLazyQuery } from '../graphql/useLazyQuery'

export const mutation = gql`
  mutation SubscribeToNewsletter($data: IPersonNewsletter!) {
    subscribeToNewsletter(data: $data) {
      id
    }
  }
`

export const useNewsletter = () => {
  const [subscribeUser, { data, error, isValidating: loading }] = useLazyQuery<
    Mutation,
    Variables
  >(mutation, {
    data: { name: '', email: '' },
  })

  return {
    subscribeUser,
    data,
    error,
    loading,
  }
}
