import { request as baseRequest } from '@faststore/graphql-utils'
import type { RequestOptions as GraphQLRequestOptions } from '@faststore/graphql-utils'

export type RequestOptions = Omit<
  GraphQLRequestOptions,
  'operationName' | 'variables'
>

export const request = async <Query = unknown, Variables = unknown>(
  operationName: string,
  variables: Variables,
  options?: RequestOptions
) => {
  const { data, errors } = await baseRequest<Variables, Query>('/api/graphql', {
    ...options,
    variables,
    operationName,
  })

  if (errors?.length) {
    throw errors[0]
  }

  return data
}
