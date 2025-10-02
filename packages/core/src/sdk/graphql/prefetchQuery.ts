import { mutate, type Cache } from 'swr'
import { GraphqlRequest, type Operation } from './request'
import { getKey } from './useQuery'

export const prefetchQuery = <Data, Variables = Record<string, unknown>>(
  operation: Operation,
  variables: Variables,
  { cache, ...options }: Partial<Omit<RequestInit, 'cache'>> & { cache: Cache }
) => {
  const key = getKey(operation['__meta__']['operationName'], variables)

  if (cache.get(key)) {
    return
  }

  mutate(
    key,
    GraphqlRequest<Data, Variables>({ operation, variables }, options)
  )
}
