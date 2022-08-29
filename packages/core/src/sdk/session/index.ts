import { gql } from '@faststore/graphql-utils'
import { createSessionStore } from '@faststore/sdk'
import { useMemo } from 'react'
import type { Session } from '@faststore/sdk'

import storeConfig from 'store.config'

import { cartStore } from '../cart'
import { request } from '../graphql/request'
import { createValidationStore, useStore } from '../useStore'
import type {
  ValidateSessionMutation,
  ValidateSessionMutationVariables,
} from '../../../@generated/graphql/index'

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

const [validationStore, onValidate] = createValidationStore(validateSession)

const defaultStore = createSessionStore(storeConfig.session, onValidate)

export const sessionStore = {
  ...defaultStore,
  set: (val: Session) => {
    defaultStore.set(val)

    // Trigger cart revalidation when session changes
    cartStore.set(cartStore.read())
  },
}

export const useSession = () => {
  const session = useStore(sessionStore)
  const isValidating = useStore(validationStore)

  return useMemo(
    () => ({
      ...session,
      isValidating,
    }),
    [isValidating, session]
  )
}
