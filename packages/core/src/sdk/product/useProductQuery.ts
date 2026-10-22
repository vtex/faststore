import { useMemo } from 'react'

import { gql } from '@generated'
import type {
  ClientProductQueryQuery,
  ClientProductQueryQueryVariables,
} from '@generated/graphql'

import { request } from '../graphql/request'
import { onErrorRetry } from '../graphql/retryPolicy'
import { useQuery } from '../graphql/useQuery'
import { useSession } from '../session'

const query = gql(`
  query ClientProductQuery($locator: [IStoreSelectedFacet!]!) {
    ...ClientProduct
    product(locator: $locator) {
      ...ProductDetailsFragment_product
    }
  }
`)

const nextTick = () => new Promise<void>((resolve) => setTimeout(resolve))

const fetchProduct = async <T extends ClientProductQueryQuery>(
  variables: ClientProductQueryQueryVariables
) => {
  await nextTick()

  return (await request<
    ClientProductQueryQuery & T,
    ClientProductQueryQueryVariables
  >(query, variables)) as ClientProductQueryQuery & T
}

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
    // `useQuery`'s default fetcher never settles when `request` throws, so SWR
    // never exposes `error` (e.g. the B2B assortment 404 the PDP reacts to).
    // This fetcher keeps the same deferral but forwards the rejection.
    fetcher: () => fetchProduct<T>(variables),
    // A 404 is the answer (the product is not available to this shopper), not
    // a transient failure, so it is not retried. Other errors follow the
    // shared retry policy.
    onErrorRetry: (error, key, config, revalidate, opts) => {
      if ((error as { status?: number } | undefined)?.status === 404) return

      onErrorRetry(error, key, config, revalidate, opts)
    },
  })
}
