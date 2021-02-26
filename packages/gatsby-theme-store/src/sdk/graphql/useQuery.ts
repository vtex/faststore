import useSWR from 'swr'
import type { ConfigInterface } from 'swr'

import { request } from './request'
import type { RequestOptions } from './request'

export type QueryOptions = ConfigInterface & RequestOptions

// TODO: Change here
export const getKey = (options: QueryOptions) =>
  `${options.sha256Hash}::${JSON.stringify(options.variables)}`

export const DEFAULT_OPTIONS = {
  errorRetryCount: 3,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: true,
}

export const useQuery = <Query = any, Variables = any>(options: QueryOptions) =>
  useSWR<Query, any[]>(getKey(options), {
    fetcher: () => request<Query, Variables>(options),
    ...DEFAULT_OPTIONS,
    ...options,
  })
