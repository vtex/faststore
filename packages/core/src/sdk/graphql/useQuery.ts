import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

import { request } from './request'
import type { RequestOptions } from './request'

export type QueryOptions = SWRConfiguration & RequestOptions

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
  operationName: string,
  variables: Variables,
  options?: QueryOptions
) =>
  useSWR<Data>(getKey(operationName, variables), {
    fetcher: () => {
      return new Promise((resolve) => {
        setTimeout(async () => {
          resolve(
            await request<Data, Variables>(operationName, variables, options)
          )
        })
      })
    },
    ...DEFAULT_OPTIONS,
    ...options,
  })
