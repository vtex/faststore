import useSWR from 'swr'

import { request } from './request'
import { DEFAULT_OPTIONS, getKey } from './useQuery'
import type { QueryOptions } from './useQuery'

export const useLazyQuery = <Query = any, Variables = any>(
  options: QueryOptions
) => {
  const response = useSWR<Query | null, any[]>(
    getKey(options),
    () => null,
    DEFAULT_OPTIONS
  )

  const execute = async (variables: Variables) => {
    const data = await request<Query, Variables>({
      ...options,
      variables,
    })

    response.mutate(data, false)
  }

  return [execute, response] as [typeof execute, typeof response]
}
