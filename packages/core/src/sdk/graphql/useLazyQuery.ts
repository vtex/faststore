import useSWR from 'swr'

import { GraphqlRequest, type Operation } from './request'
import { DEFAULT_OPTIONS, getKey, type QueryOptions } from './useQuery'

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
    const { data } = await GraphqlRequest<Data, Variables>(
      { operation, variables: queryVariables },
      options
    )

    const updatedData = await response.mutate(data, false)
    return updatedData
  }

  return [execute, response] as [typeof execute, typeof response]
}
