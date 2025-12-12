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
  cacheBusting?: boolean
}

const DEFAULT_HEADERS_BY_VERB: Record<string, Record<string, string>> = {
  POST: {
    'Content-Type': 'application/json',
  },
}

/**
 * Checks if there is any cookie that starts with 'VtexIdclientAutCookie'
 * in the browser cookies
 */
const hasVtexIdclientAutCookie = (): boolean => {
  if (typeof document === 'undefined') {
    return false
  }

  const cookies = document.cookie.split(';').map((cookie) => cookie.trim())
  return cookies.some((cookie) => {
    const cookieName = cookie.split('=')[0]
    return cookieName.startsWith('VtexIdclientAutCookie')
  })
}

export const request = async <Query = unknown, Variables = unknown>(
  operation: Operation,
  variables: Variables,
  options?: RequestOptions
) => {
  const hasAuthCookie = hasVtexIdclientAutCookie()

  // If there is a VtexIdclientAutCookie, we need to cache bust to get updated values according to the user's session
  const { data, errors } = await baseRequest<Variables, Query>('/api/graphql', {
    ...options,
    variables,
    operation,
    cacheBusting: hasAuthCookie,
  })

  if (errors?.length) {
    throw errors[0]
  }

  return data
}

/* This piece of code was taken out of @faststore/graphql-utils */
const baseRequest = async <V = any, D = any>(
  endpoint: string,
  {
    operation,
    variables,
    fetchOptions,
    cacheBusting = false,
  }: BaseRequestOptions<V>
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
    ...(method === 'GET' && cacheBusting && { v: '1' }),
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

  if (!response.ok) {
    const statusText = response.statusText
    return {
      errors: [
        {
          status: response.status,
          message: statusText,
        },
      ],
      data: undefined,
    } as GraphQLResponse<D>
  }

  return response.json()
}
