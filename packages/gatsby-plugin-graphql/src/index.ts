export const isProduction = process.env.NODE_ENV === 'production'

export const gql = (_: TemplateStringsArray) => {
  throw new Error('This Should be removed by the babel plugin')
}

export interface GraphQLResponse<D extends any = any> {
  data: D
  errors: any[]
}

export interface RequestOptions<V extends any = any> {
  query?: string
  sha256Hash: string
  operationName: string
  variables: V
  fetchOptions?: RequestInit
}

export const request = async <V extends any = any, D extends any = any>(
  endpoint: string,
  {
    query,
    sha256Hash,
    operationName,
    variables,
    fetchOptions,
  }: RequestOptions<V>
): Promise<GraphQLResponse<D>> => {
  const method =
    isProduction && operationName.endsWith('Query') ? 'GET' : 'POST'

  const extensions = isProduction
    ? {
        persistedQuery: {
          sha256Hash,
        },
      }
    : undefined

  const params = new URLSearchParams({
    operationName,
    extensions: extensions && JSON.stringify(extensions),
    variables: method === 'GET' ? JSON.stringify(variables) : undefined,
  } as any)

  const url = `${endpoint}?${params.toString()}`

  const body =
    method === 'POST'
      ? JSON.stringify({
          operationName,
          extensions,
          variables,
          query,
        })
      : undefined

  const response = await fetch(url, {
    method,
    body,
    ...fetchOptions,
  })

  return response.json()
}
