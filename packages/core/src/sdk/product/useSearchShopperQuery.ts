import { useMemo } from 'react'

import { gql } from '@generated'

import type {
  ClientSearchShopperQueryQuery,
  ClientSearchShopperQueryQueryVariables,
} from '@generated/graphql'
import { useQuery } from '../graphql/useQuery'

const query = gql(`
  query ClientSearchShopperQuery($userId: String, $name: String) {
    searchShopper(userId: $userId, name: $name) {
      shoppers {
        userId
        firstName
        lastName
      }
    }
  }
`)

export const useSearchShopperQuery = <T extends ClientSearchShopperQueryQuery>({
  name,
}: {
  userId?: string
  name?: string
}) => {
  const variables = useMemo(() => {
    return {
      name,
      userId: undefined,
    }
  }, [name])

  return useQuery<
    ClientSearchShopperQueryQuery & T,
    ClientSearchShopperQueryQueryVariables
  >(query, variables, {
    doNotRun: !name,
  })
}
