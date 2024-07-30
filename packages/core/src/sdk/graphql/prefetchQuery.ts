import type { Cache } from 'swr'
import { mutate } from 'swr'

import type { Operation, RequestOptions } from 'app/sdk/graphql/request'
import { request } from 'app/sdk/graphql/request'
import { getKey } from 'app/sdk/graphql/useQuery'

export const prefetchQuery = <Data, Variables = Record<string, unknown>>(
  operation: Operation,
  variables: Variables,
  { cache, ...options }: Partial<RequestOptions> & { cache: Cache }
) => {
  const key = getKey(operation['__meta__']['operationName'], variables)

  if (cache.get(key)) {
    return
  }

  mutate(key, request<Data, Variables>(operation, variables, options))
}
