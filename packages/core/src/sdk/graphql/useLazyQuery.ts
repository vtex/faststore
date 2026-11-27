import { useCallback, useRef } from 'react'
import useSWR from 'swr'

import { type Operation, request } from './request'
import { DEFAULT_OPTIONS, getKey } from './useQuery'
import type { QueryOptions } from './useQuery'

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

  // Keep `execute` referentially stable. Callers list it in effect deps, and a
  // new identity on every render re-runs those effects (and their requests) on
  // unrelated re-renders. The ref always holds the latest operation/options.
  const latestRef = useRef({ operation, options, mutate: response.mutate })
  latestRef.current = { operation, options, mutate: response.mutate }

  const execute = useCallback(async (queryVariables: Variables) => {
    const { operation, options, mutate } = latestRef.current
    const data = await request<Data, Variables>(
      operation,
      queryVariables,
      options
    )

    const updatedData = await mutate(data, false)
    return updatedData
  }, [])

  return [execute, response] as [typeof execute, typeof response]
}
