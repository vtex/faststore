import useSWR, { ConfigInterface } from 'swr'

import { request, RequestOptions } from './request'

export type QueryOptions = ConfigInterface & RequestOptions

const getKey = (options: QueryOptions) =>
  `${options.sha256Hash}::${JSON.stringify(options.variables)}`

export const useQuery = <Query extends any = any, Variables extends any = any>(
  options: QueryOptions
) =>
  useSWR<Query, any[]>(getKey(options), {
    fetcher: () => request<Query, Variables>(options),
    ...options,
  })
