import { gql } from '@generated'
import {
  ClientBuyerOrgQueryQuery,
  ClientBuyerOrgQueryQueryVariables,
} from '@generated/graphql'
import type { QueryOptions } from '../graphql/useQuery'

import { useQuery } from '../graphql/useQuery'

export const query = gql(`
  query ClientBuyerOrgQuery($customerId: String!) {
    buyerOrg(customerId: $customerId) {
      id
      name
      email
    }
  }
`)

/**
 * Use this hook for fetching a buyer org data for a customer
 */
export const useProductsQuery = (
  variables: ClientBuyerOrgQueryQueryVariables,
  options?: QueryOptions
) => {
  const { data } = useQuery<
    ClientBuyerOrgQueryQuery,
    ClientBuyerOrgQueryQueryVariables
  >(query, variables, {
    fallbackData: null,
    suspense: true,
    ...options,
  })

  return data
}
