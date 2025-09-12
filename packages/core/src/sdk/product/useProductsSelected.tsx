import { gql } from '@vtex/faststore-core'
import { useQuery } from '../graphql/useQuery'
import { useSession } from '../session'
import { useMemo } from 'react'
import type {
  ClientManyProductsSelectedQueryQuery,
  ClientManyProductsSelectedQueryQueryVariables,
  ClientSearchSuggestionsQueryQuery,
} from '../../../@generated/graphql'

const query = gql(`
  query ClientManyProductsSelectedQuery(
    $productIds: [String!]!
  ) {
    products(productIds: $productIds) {
      ...ProductComparisonFragment_product
    }
  }
`)

export const useProductsSelected = (
  productIds: string[],
  enabled: boolean,
  processResponse: (data: ClientManyProductsSelectedQueryQuery) => void
) => {
  const { channel, locale } = useSession()
  const variables = useMemo(() => {
    if (!channel) {
      throw new Error(
        `useProductsSelected: 'channel' from session is an empty string.`
      )
    }

    return { productIds }
  }, [channel, locale, productIds])

  return useQuery<
    ClientSearchSuggestionsQueryQuery,
    ClientManyProductsSelectedQueryQueryVariables
  >(query, variables, {
    doNotRun: enabled,
    onSuccess: (data: ClientManyProductsSelectedQueryQuery) =>
      processResponse(data),
  })
}
