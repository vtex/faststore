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
    () =>
      options?.doNotRun
        ? null
        : getKey(operation['__meta__']['operationName'], variables),
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
