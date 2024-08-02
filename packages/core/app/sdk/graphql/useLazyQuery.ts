import useSWR from 'swr'

import { type Operation, request } from './request'
import type { QueryOptions } from './useQuery'
import { DEFAULT_OPTIONS, getKey } from './useQuery'

export const useLazyQuery = <Data, Variables = Record<string, unknown>>(
  operation: Operation,
  variables: Variables,
  options?: QueryOptions
) => {
  const response = useSWR<Data | null>(
    getKey(operation['__meta__']['operationName'], variables),
    () => null,
    DEFAULT_OPTIONS
  )

  const execute = async (queryVariables: Variables) => {
    const data = await request<Data, Variables>(
      operation,
      queryVariables,
      options
    )

    response.mutate(data, false)
  }

  return [execute, response] as [typeof execute, typeof response]
}
