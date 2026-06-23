import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

import { request } from './request'
import type { Operation, RequestOptions } from './request'

export type QueryOptions = SWRConfiguration &
  RequestOptions & { doNotRun?: boolean }

export const getKey = <Variables>(
  operationName: string,
  variables: Variables
) => `${operationName}::${JSON.stringify(variables)}`

export const DEFAULT_OPTIONS: SWRConfiguration = {
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
      if (options?.doNotRun) {
        return null
      }

      const operationName = operation['__meta__']?.['operationName'] ?? ''

      return getKey(operationName, variables)
    },
    {
      fetcher: () => request<Data, Variables>(operation, variables, options),
      ...DEFAULT_OPTIONS,
      ...options,
    }
  )
