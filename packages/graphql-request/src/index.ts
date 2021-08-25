import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

const isProduction = process.env.NODE_ENV === 'production'

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

const defaultFetchOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
}

export const graphqlRequest = async <V = any, D = any>(
  endpoint: string,
  {
    query,
    sha256Hash,
    operationName,
    variables,
    fetchOptions,
  }: RequestOptions<V>
): Promise<D> => {
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

  let url = endpoint

  if (method === 'GET') {
    const params = new URLSearchParams({
      operationName,
      extensions:
        method === 'GET' && isProduction
          ? JSON.stringify(extensions)
          : undefined,
      variables:
        method === 'GET' && isProduction
          ? JSON.stringify(variables)
          : undefined,
    } as any)

    url += `?${params.toString()}`
  }

  const body =
    method === 'POST'
      ? JSON.stringify({
          operationName,
          extensions:
            process.env.NODE_ENV === 'production' ? extensions : undefined,
          variables,
          query: process.env.NODE_ENV === 'production' ? undefined : query,
        })
      : undefined

  const response = await fetch(url, {
    method,
    body,
    ...defaultFetchOptions,
    ...fetchOptions,
    headers: {
      ...defaultFetchOptions.headers,
      ...fetchOptions?.headers,
    },
  })

  const { data, errors } = await response.json()

  if (errors?.length) {
    throw errors[0]
  }

  return data
}

export type QueryOptions = SWRConfiguration & RequestOptions

export const getKey = (options: QueryOptions) => {
  return `${options.sha256Hash || options.query}::${JSON.stringify(
    options.variables
  )}`
}

export const DEFAULT_OPTIONS = {
  errorRetryCount: 3,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: true,
}

export const useQuery = <Data = any, Variables = any>(
  endpoint: string,
  options: QueryOptions
) => {
  return useSWR<Data, any[]>(getKey(options), {
    fetcher: () => graphqlRequest<Variables, Data>(endpoint, options),
    ...DEFAULT_OPTIONS,
    ...options,
  })
}
