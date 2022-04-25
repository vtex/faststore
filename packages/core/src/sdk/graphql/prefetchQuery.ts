import { mutate } from 'swr'

import { request } from './request'
import { getKey } from './useQuery'
import type { RequestOptions } from './request'

export const prefetchQuery = <Data, Variables = Record<string, unknown>>(
  operationName: string,
  variables: Variables,
  options?: RequestOptions
) => {
  mutate(
    getKey(operationName, variables),
    request<Data, Variables>(operationName, variables, options)
  )
}
