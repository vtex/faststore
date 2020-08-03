export interface QueryInfo {
  query?: string
  sha256Hash: string
}

export interface QueryInfoByOperationName {
  [x: string]: QueryInfo
}

const isProduction = process.env.NODE_ENV === 'production'

export const PLUGIN_GLOBAL_VARIABLE = '__GATSBY_PLUGIN_GRAPHQL__'

export const getQueryInfo = async (
  operationName: string
): Promise<QueryInfo> => {
  const operationNames: QueryInfoByOperationName = await (window as any)[
    PLUGIN_GLOBAL_VARIABLE
  ]

  return operationNames[operationName]
}

export const gql = (_: TemplateStringsArray) => {
  throw new Error('This Should be removed by the babel plugin')
}

export interface GraphQLResponse<D extends any = any> {
  data: D
  errors: any[]
}

export interface RequestOptions<V extends any = any> {
  operationName: string
  variables: V
  fetchOptions?: RequestInit
}

export const request = async <V extends any = any, D extends any = any>(
  endpoint: string,
  { operationName, variables, fetchOptions }: RequestOptions<V>
): Promise<GraphQLResponse<D>> => {
  const { query, sha256Hash } = await getQueryInfo(operationName)

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
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      ...fetchOptions?.headers,
    },
  })

  return response.json()
}
