import { TypedDocumentString } from '@generated/graphql'

export type RequestOptions = Omit<BaseRequestOptions, 'operation' | 'variables'>
export type Operation = Pick<TypedDocumentString<any, any>, '__meta__'>

export interface GraphQLResponse<D = any> {
  data: D
  errors: any[]
}

export interface BaseRequestOptions<V = any> {
  operation: Operation
  variables: V
  fetchOptions?: RequestInit
}

const DEFAULT_HEADERS_BY_VERB: Record<string, Record<string, string>> = {
  POST: {
    'Content-Type': 'application/json',
  },
}

export const request = async <Query = unknown, Variables = unknown>(
  operation: Operation,
  variables: Variables,
  options?: RequestOptions
) => {
  const { data, errors } = await baseRequest<Variables, Query>('/api/graphql', {
    ...options,
    variables,
    operation,
  })

  if (errors?.length) {
    throw errors[0]
  }

  return data
}

/* This piece of code was taken out of @faststore/graphql-utils */
const baseRequest = async <V = any, D = any>(
  endpoint: string,
  { operation, variables, fetchOptions }: BaseRequestOptions<V>
): Promise<GraphQLResponse<D>> => {
  const { operationName, operationHash } = operation['__meta__']

  // Uses method from fetchOptions.
  // If no one is passed, figure out with via heuristic
  const method =
    fetchOptions?.method !== undefined
      ? fetchOptions.method.toUpperCase()
      : operationName.endsWith('Query')
      ? 'GET'
      : 'POST'

  const params = new URLSearchParams({
    operationName,
    operationHash,
    ...(method === 'GET' && { variables: JSON.stringify(variables) }),
  })

  const body =
    method === 'POST'
      ? JSON.stringify({
          operationName,
          operationHash,
          variables,
        })
      : undefined

  const url = `${endpoint}?${params.toString()}`

  const response = await fetch(url, {
    method,
    body,
    ...fetchOptions,
    headers: {
      ...DEFAULT_HEADERS_BY_VERB[method],
      ...fetchOptions?.headers,
    },
  })

  return response.json()
}
