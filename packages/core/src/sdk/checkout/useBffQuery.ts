import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

import { bffRequest } from './bffClient'

export interface BffQueryOptions extends SWRConfiguration {
  skip?: boolean
}

/**
 * SWR wrapper for BFF GraphQL queries.
 * Uses the query string + serialized variables as the cache key.
 */
export function useBffQuery<
  Data = unknown,
  Variables = Record<string, unknown>,
>(
  operationName: string,
  query: string,
  variables?: Variables,
  options?: BffQueryOptions
) {
  const key = options?.skip
    ? null
    : `bff::${operationName}::${JSON.stringify(variables ?? {})}`

  return useSWR<Data>(key, {
    fetcher: () => bffRequest<Data, Variables>(query, variables),
    errorRetryCount: 3,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...options,
  })
}
