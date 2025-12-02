export type RequestOptions = Omit<BaseRequestOptions, 'operation' | 'variables'>

export type Operation = {
  __meta__?: Record<string, any>
}

export interface GraphQLResponse<Data = any> {
  data?: Data
  errors?: any[]
}

export interface BaseRequestOptions<V = any> {
  operation: Operation
  variables: V
  fetchOptions?: RequestInit
}

const MethodByOperation = async (operationName: string) => {
  const { experimental } = await import('../../../discovery.config')
  return Array.isArray(experimental.cachedOperations) &&
    experimental.cachedOperations.includes(operationName)
    ? 'GET'
    : 'POST'
}

/* This piece of code was taken out of @vtex/faststore-graphql-utils */
const baseRequest = async <Variables, Operation>(
  endpoint: string,
  { operation, variables, fetchOptions }: BaseRequestOptions<Variables>
): Promise<GraphQLResponse<Operation>> => {
  const { operationName, operationHash } = operation['__meta__']

  // Uses method from fetchOptions.
  // If no one is passed, figure out with via heuristic
  const method =
    fetchOptions?.method?.toUpperCase() ??
    (await MethodByOperation(operationName))

  const response = await (method === 'POST' ? POSTRequest : GETRequest)({
    endpoint,
    operation,
    variables,
    fetchOptions,
  })

  return ParseInvalidRequest(response) ?? response.json()
}

const GETRequest = <Variables>({
  operation,
  variables,
  fetchOptions,
  endpoint,
}: BaseRequestOptions<Variables> & { endpoint: string }) => {
  const { operationName, operationHash } = operation['__meta__']
  const params = new URLSearchParams({
    operationName,
    operationHash,
    variables: JSON.stringify(variables),
  })

  const url = `${endpoint}?${params.toString()}`

  return fetch(url, {
    method: 'GET',
    body: undefined,
    ...fetchOptions,
  })
}

const POSTRequest = <Variables>({
  operation,
  variables,
  fetchOptions,
  endpoint,
}: BaseRequestOptions<Variables> & { endpoint: string }) => {
  const { operationName, operationHash } = operation['__meta__']
  const params = new URLSearchParams({
    operationName,
    operationHash,
  })
  const url = `${endpoint}?${params.toString()}`

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      operationName,
      operationHash,
      variables,
    }),
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions?.headers,
    },
  })
}

const ParseInvalidRequest = <T>(
  response: Awaited<ReturnType<typeof fetch>>
) => {
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
    } as GraphQLResponse<T>
  }
}

export async function GraphqlRequest<Query = unknown, Variables = unknown>(
  { operation, variables }: { operation: Operation; variables: Variables },
  options?: RequestInit
): Promise<GraphQLResponse<Query>> {
  const response = await baseRequest<Variables, Query>('/api/graphql', {
    variables,
    operation,
    fetchOptions: options,
  })

  // in Order to keep the same behaviour of previous version (request) throwing error
  if (response.errors?.length) {
    throw response.errors[0]
  }

  return response
}

/**
 * @description It only exists to backward compatibilities
 */
export async function request<Query = unknown, Variables = unknown>(
  operation: Operation,
  variables: Variables,
  options?: RequestOptions
) {
  return (
    await GraphqlRequest<Query, Variables>(
      { operation, variables },
      options?.fetchOptions
    )
  ).data
}
