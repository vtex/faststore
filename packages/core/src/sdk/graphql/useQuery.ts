import type { SWRConfiguration } from 'swr'
import useSWR from 'swr'

import { getClientCacheBustingValue } from 'src/utils/cookieCacheBusting'

import type { Operation, RequestOptions } from './request'
import { request } from './request'
import { onErrorRetry } from './retryPolicy'

export type QueryOptions = SWRConfiguration &
  RequestOptions & { doNotRun?: boolean }

export const getKey = <Variables>(
  operationName: string,
  variables: Variables
) => `${operationName}::${JSON.stringify(variables)}`

/**
 * Returns a suffix for the cache key based on auth state (logged-in vs anonymous).
 * This ensures SWR keeps separate cache entries for logged-in and logged-out users,
 * avoiding stale product data (e.g. prices, availability) when switching session state.
 */
const getSessionCacheKeySuffix = (): string => {
  if (typeof window === 'undefined') {
    return ''
  }
  const value = getClientCacheBustingValue()
  return value ?? ''
}

export const DEFAULT_OPTIONS = {
  errorRetryCount: 3,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: true,
  onErrorRetry,
}

export const useQuery = <Data, Variables = Record<string, unknown>>(
  operation: Operation,
  variables: Variables,
  options?: QueryOptions
) =>
  useSWR<Data>(
    () => {
      if (options?.doNotRun) return null
      const baseKey = getKey(operation['__meta__']['operationName'], variables)
      const sessionSuffix = getSessionCacheKeySuffix()
      return `${baseKey}::${sessionSuffix}`
    },
    {
      // Defers the request to the next task, then chains it so a GraphQL
      // error thrown by `request` rejects the promise SWR gets. Awaiting it
      // inside the `setTimeout` callback left the promise pending forever.
      fetcher: () =>
        new Promise<void>((resolve) => setTimeout(resolve)).then(() =>
          request<Data, Variables>(operation, variables, options)
        ),
      ...DEFAULT_OPTIONS,
      ...options,
    }
  )
