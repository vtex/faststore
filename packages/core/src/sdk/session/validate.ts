import { gql } from '@vtex/graphql-utils'
import type { Session } from '@faststore/sdk'

import type {
  ValidateSessionMutation,
  ValidateSessionMutationVariables,
} from '../../../@generated/graphql/index'
import { request } from '../graphql/request'

export const mutation = gql`
  mutation ValidateSession($session: IStoreSession!, $search: String!) {
    validateSession(session: $session, search: $search) {
      locale
      channel
      country
      postalCode
      currency {
        code
        symbol
      }
      person {
        id
        email
        givenName
        familyName
      }
    }
  }
`

export const validateSession = async (session: Session) => {
  const data = await request<
    ValidateSessionMutation,
    ValidateSessionMutationVariables
  >(mutation, { session, search: window.location.search })

  return data.validateSession
}
