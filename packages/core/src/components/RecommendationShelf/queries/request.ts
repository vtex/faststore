export type RequestOptions = Omit<BaseRequestOptions, 'operation' | 'variables'>
export type Operation = {
  __meta__?: Record<string, any>
}

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
    throw new Error('GraphQL error', { cause: errors })
  }

  return data
}

/* This piece of code was taken out of @faststore/graphql-utils */
const baseRequest = async <V = any, D = any>(
  endpoint: string,
  { operation, variables, fetchOptions }: BaseRequestOptions<V>
): Promise<GraphQLResponse<D>> => {
  const operationName = operation['__meta__']?.['operationName']
  const operationHash = operation['__meta__']?.['operationHash']

  // Uses method from fetchOptions.
  // If no one is passed, figure out with via heuristic
  const resolveMethod = (): string => {
    if (fetchOptions?.method) {
      return fetchOptions.method.toUpperCase()
    }

    return operationName.endsWith('Query') ? 'GET' : 'POST'
  }

  const method = resolveMethod()

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

  const contentType = response.headers.get('Content-Type')

  let responseBody = null

  if (contentType?.includes('application/json')) {
    try {
      responseBody = await response.json()
    } catch (error) {
      console.error('Error parsing JSON', error)
      throw new Error('Error parsing JSON response')
    }
  } else if (contentType?.includes('text/plain')) {
    responseBody = await response.text()
  }

  if (response.ok) {
    return responseBody
  }

  throw new Error('Error while fetching', { cause: responseBody })
}
