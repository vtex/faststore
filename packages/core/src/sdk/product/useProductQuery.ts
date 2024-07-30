import { useMemo } from 'react'

import { gql } from '@generated'
import type {
  ClientProductQueryQuery,
  ClientProductQueryQueryVariables,
} from '@generated/graphql'

import { useQuery } from 'app/sdk/graphql/useQuery'
import { useSession } from '../session'

const query = gql(`
  query ClientProductQuery($locator: [IStoreSelectedFacet!]!) {
    ...ClientProduct
    product(locator: $locator) {
      ...ProductDetailsFragment_product
    }
  }
`)

export const useProductQuery = <T extends ClientProductQueryQuery>(
  productID: string,
  fallbackData?: T
) => {
  const { channel, locale } = useSession()
  const variables = useMemo(() => {
    if (!channel) {
      throw new Error(
        `useProductQuery: 'channel' from session is an empty string.`
      )
    }

    return {
      locator: [
        { key: 'id', value: productID },
        { key: 'channel', value: channel },
        { key: 'locale', value: locale },
      ],
    }
  }, [channel, locale, productID])

  return useQuery<
    ClientProductQueryQuery & T,
    ClientProductQueryQueryVariables
  >(query, variables, {
    fallbackData,
    revalidateOnMount: true,
  })
}
