export const gql = (_: TemplateStringsArray) => {
  throw new Error(
    `[graphql-utils]: This should have been removed by the babel plugin. Please make sure the babel plugin is configured correctly`
  )
}

export interface GraphQLResponse<D = any> {
  data: D
  errors: any[]
}

export interface RequestOptions<V = any> {
  operationName: string
  variables: V
  fetchOptions?: RequestInit
}

const DEFAULT_HEADERS_BY_VERB: Record<string, Record<string, string>> = {
  POST: {
    'Content-Type': 'application/json',
  },
}

export const request = async <V = any, D = any>(
  endpoint: string,
  { operationName, variables, fetchOptions }: RequestOptions<V>
): Promise<GraphQLResponse<D>> => {
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
    ...(method === 'GET' && { variables: JSON.stringify(variables) }),
  })

  const body =
    method === 'POST'
      ? JSON.stringify({
          operationName,
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
