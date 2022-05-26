import { useSession } from '@faststore/sdk'
import { useMemo } from 'react'
import { gql } from '@vtex/graphql-utils'

import type {
  BrowserProductQueryQuery,
  BrowserProductQueryQueryVariables,
} from '@generated/graphql'

import { useQuery } from '../graphql/useQuery'

const query = gql`
  query BrowserProductQuery($locator: [IStoreSelectedFacet!]!) {
    product(locator: $locator) {
      ...ProductDetailsFragment_product
    }
  }
`

export const useProduct = <T extends BrowserProductQueryQuery>(
  productID: string,
  fallbackData?: T
) => {
  const { channel, locale } = useSession()
  const variables = useMemo(() => {
    if (!channel) {
      throw new Error(`useProduct: 'channel' from session is an empty string.`)
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
    BrowserProductQueryQuery & T,
    BrowserProductQueryQueryVariables
  >(query, variables, {
    fallbackData,
    revalidateOnMount: true,
  })
}
