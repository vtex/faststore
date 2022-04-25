import { useEffect } from 'react'
import { gql } from '@vtex/graphql-utils'
import { useSession } from '@faststore/sdk'

import type {
  PersonQueryQuery,
  PersonQueryQueryVariables,
} from '@generated/graphql'

import { useQuery } from '../graphql/useQuery'
import type { QueryOptions } from '../graphql/useQuery'

export const query = gql`
  query PersonQuery {
    person {
      id
      email
      givenName
      familyName
    }
  }
`

const usePersonQuery = (options?: QueryOptions) => {
  const { data } = useQuery<PersonQueryQuery, PersonQueryQueryVariables>(
    query,
    {},
    { ...options, fetchOptions: { ...options?.fetchOptions, method: 'POST' } }
  )

  const { setSession, user, ...session } = useSession()
  const person = data?.person

  useEffect(() => {
    if (!!person && person !== user) {
      setSession({
        ...session,
        user: person,
      })
    }
  }, [person, user, session, setSession])

  return person
}

export default usePersonQuery
