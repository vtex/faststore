import { gql } from '@generated'

import type {
  SetPasswordMutation as Mutation,
  SetPasswordMutationVariables as Variables,
} from '../../../@generated/graphql'
import { useLazyQuery } from '../graphql/useLazyQuery'

export const mutation = gql(`
  mutation SetPassword($data: ISetPassword!) {
    setPassword(data: $data) {
      success
      message
    }
  }
`)

export const useSetPassword = () => {
  const [setPassword, { data, error, isValidating, isLoading }] = useLazyQuery<
    Mutation,
    Variables
  >(mutation, {
    data: {
      email: '',
      newPassword: '',
      currentPassword: '',
      accesskey: undefined,
      recaptcha: undefined,
    },
  })

  return {
    setPassword,
    data,
    error,
    loading: isLoading || isValidating,
  }
}
