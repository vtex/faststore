import { gql } from '@generated'
import { useLazyQuery } from '../graphql/useLazyQuery'
import type {
  MutationProcessOrderAuthorizationArgs as Variables,
  ProcessOrderAuthorizationMutationMutation,
} from '@generated/graphql'

export const mutation = gql(`
  mutation ProcessOrderAuthorizationMutation($data: IProcessOrderAuthorization!) {
    processOrderAuthorization(data: $data) {
      isPendingForOtherAuthorizer
      ruleForAuthorization {
        orderAuthorizationId
        dimensionId
        rule {
          id
          name
          status
          doId
          authorizedEmails
          priority
          trigger {
            condition {
              conditionType
              description
              lessThan
              greatherThan
              expression
            }
            effect {
              description
              effectType
              funcPath
            }
          }
          timeout
          notification
          scoreInterval {
            accept
            deny
          }
          authorizationData {
            requireAllApprovals
            authorizers {
              id
              email
              type
              authorizationDate
            }
          }
          isUserAuthorized
          isUserNextAuthorizer
        }
      }
    }
  }
`)

export const useOrderAuthorization = () => {
  const [processOrderAuthorization, { data, error, isValidating: loading }] =
    useLazyQuery<ProcessOrderAuthorizationMutationMutation, Variables>(
      mutation,
      {
        data: {
          orderAuthorizationId: '',
          ruleId: '',
          dimensionId: '',
          approved: false,
        },
      }
    )

  return {
    processOrderAuthorization,
    data: data?.processOrderAuthorization || null,
    error,
    loading,
  }
}
