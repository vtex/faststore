import { mutate } from 'swr'
import type { Cache } from 'swr'

import { request } from './request'
import { getKey } from './useQuery'
import type { RequestOptions } from './request'

export const prefetchQuery = <Data, Variables = Record<string, unknown>>(
  operationName: string,
  variables: Variables,
  { cache, ...options }: Partial<RequestOptions> & { cache: Cache }
) => {
  const key = getKey(operationName, variables)

  if (cache.get(key)) {
    return
  }

  mutate(key, request<Data, Variables>(operationName, variables, options))
}
