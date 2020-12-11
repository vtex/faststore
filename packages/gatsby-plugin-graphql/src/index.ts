export const isProduction = process.env.NODE_ENV === 'production'

export const gql = (_: TemplateStringsArray) => {
  throw new Error('This should have been removed by the babel plugin')
}

export interface GraphQLResponse<D = any> {
  data: D
  errors: any[]
}

export interface RequestOptions<V = any> {
  query?: string
  sha256Hash: string
  operationName: string
  variables: V
  fetchOptions?: RequestInit
}

export const request = async <V = any, D = any>(
  endpoint: string,
  {
    query,
    sha256Hash,
    operationName,
    variables,
    fetchOptions,
  }: RequestOptions<V>
): Promise<GraphQLResponse<D>> => {
  // Uses method from fetchOptions.
  // If no one is passed, figure out with via heuristic
  const method =
    fetchOptions?.method !== undefined
      ? fetchOptions.method
      : isProduction && operationName.endsWith('Query')
      ? 'GET'
      : 'POST'

  const extensions = {
    persistedQuery: {
      sha256Hash,
    },
  }

  const params = new URLSearchParams({
    operationName,
    extensions:
      method === 'GET' && isProduction ? JSON.stringify(extensions) : undefined,
    variables:
      method === 'GET' && isProduction ? JSON.stringify(variables) : undefined,
  } as any)

  const url = `${endpoint}?${params.toString()}`

  const body =
    method === 'POST'
      ? JSON.stringify({
          operationName,
          extensions: isProduction ? extensions : undefined,
          variables,
          query: isProduction ? undefined : query,
        })
      : undefined

  const response = await fetch(url, {
    method,
    body,
    ...fetchOptions,
  })

  return response.json()
}
