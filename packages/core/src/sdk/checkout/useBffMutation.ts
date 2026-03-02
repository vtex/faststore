import { useCallback } from 'react'
import { useSWRConfig } from 'swr'

import { bffRequest } from './bffClient'

/**
 * Returns a mutation function that sends a GraphQL mutation to the BFF
 * and revalidates all BFF queries matching the given key prefix.
 */
export function useBffMutation<
  Data = unknown,
  Variables = Record<string, unknown>,
>(query: string) {
  const { mutate } = useSWRConfig()

  const execute = useCallback(
    async (variables?: Variables): Promise<Data> => {
      const data = await bffRequest<Data, Variables>(query, variables)

      // Revalidate all BFF queries after mutation
      await mutate(
        (key: string) => typeof key === 'string' && key.startsWith('bff::'),
        undefined,
        { revalidate: true }
      )

      return data
    },
    [query, mutate]
  )

  return execute
}
