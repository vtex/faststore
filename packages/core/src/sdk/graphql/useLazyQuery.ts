import useSWR from 'swr'

import { request } from './request'
import { DEFAULT_OPTIONS, getKey } from './useQuery'
import type { QueryOptions } from './useQuery'
import { TypedDocumentString } from '@generated/graphql'

export const useLazyQuery = <Data, Variables = Record<string, unknown>>(
  operation: TypedDocumentString<any, any>,
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
