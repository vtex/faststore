import type { SWRConfiguration } from 'swr'
import useSWR from 'swr'

import { getClientCacheBustingValue } from 'src/utils/cookieCacheBusting'
import { sessionStore } from 'src/sdk/session'

import type { Operation, RequestOptions } from './request'
import { request } from './request'

export type QueryOptions = SWRConfiguration &
  RequestOptions & { doNotRun?: boolean; keySuffix?: string }

export const getKey = <Variables>(
  operationName: string,
  variables: Variables
) => `${operationName}::${JSON.stringify(variables)}`

/**
 * Returns a suffix for the cache key based on auth state and region.
 * This ensures SWR keeps separate cache entries for:
 * - logged-in vs anonymous users (via person.id)
 * - different postal codes / regions (via postalCode)
 * Avoiding stale product data (e.g. prices, availability, delivery facets) when
 * switching session state or region.
 */
const getSessionCacheKeySuffix = (): string => {
  if (typeof window === 'undefined') {
    return ''
  }
  const authValue = getClientCacheBustingValue()
  const postalCode =
    sessionStore.read()?.postalCode ??
    sessionStore.readInitial()?.postalCode ??
    ''
  return `${authValue ?? ''}::${postalCode}`
}

export const DEFAULT_OPTIONS = {
  errorRetryCount: 3,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: true,
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
      const extra = options?.keySuffix ? `::${options.keySuffix}` : ''
      return `${baseKey}::${sessionSuffix}${extra}`
    },
    {
      fetcher: () => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            resolve(
              await request<Data, Variables>(operation, variables, options)
            )
          })
        })
      },
      ...DEFAULT_OPTIONS,
      ...options,
    }
  )
