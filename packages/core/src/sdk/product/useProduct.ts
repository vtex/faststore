import { gql } from '@faststore/graphql-utils'
import { useMemo } from 'react'

import type {
  ClientProductQueryQuery,
  ClientProductQueryQueryVariables,
} from '@generated/graphql'

import { useQuery } from '../graphql/useQuery'
import { useSession } from '../session'

const query = gql`
  query ClientProductQuery($locator: [IStoreSelectedFacet!]!) {
    ...ClientProductFragment
    product(locator: $locator) {
      ...ProductDetailsFragment_product
    }
  }
`

export const useProduct = <T extends ClientProductQueryQuery>(
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
    ClientProductQueryQuery & T,
    ClientProductQueryQueryVariables
  >(query, variables, {
    fallbackData,
    revalidateOnMount: true,
  })
}
