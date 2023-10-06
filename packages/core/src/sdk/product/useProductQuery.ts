import { gql } from '@faststore/graphql-utils'
import { useMemo } from 'react'

import type {
  ClientSingleProductQueryQuery,
  ClientSingleProductQueryQueryVariables,
} from '@generated/graphql'

import { useQuery } from '../graphql/useQuery'
import { useSession } from '../session'

const query = gql`
  query ClientSingleProductQuery($locator: [IStoreSelectedFacet!]!) {
    ...ClientSingleProduct
    product(locator: $locator) {
      ...ProductDetailsFragment_product
    }
  }
`

export const useProductQuery = <T extends ClientSingleProductQueryQuery>(
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
    ClientSingleProductQueryQuery & T,
    ClientSingleProductQueryQueryVariables
  >(query, variables, {
    fallbackData,
    revalidateOnMount: true,
  })
}
