import useSWR from 'swr'

import { request } from './request'
import { DEFAULT_OPTIONS, getKey } from './useQuery'
import type { QueryOptions } from './useQuery'

export const useLazyQuery = <Data, Variables = Record<string, unknown>>(
  operationName: string,
  variables: Variables,
  options?: QueryOptions
) => {
  const response = useSWR<Data | null>(
    getKey(operationName, variables),
    () => null,
    DEFAULT_OPTIONS
  )

  const execute = async (queryVariables: Variables) => {
    const data = await request<Data, Variables>(
      operationName,
      queryVariables,
      options
    )

    response.mutate(data, false)
  }

  return [execute, response] as [typeof execute, typeof response]
}
