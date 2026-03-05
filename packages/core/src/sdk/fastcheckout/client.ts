const FC_BFF_PROXY = '/api/fc/graphql'

interface GraphQLResponse<T> {
  data: T
  errors?: Array<{ message: string }>
}

export async function fcBffRequest<TData, TVars = Record<string, unknown>>(
  query: string,
  variables?: TVars,
  signal?: AbortSignal
): Promise<TData> {
  const response = await fetch(FC_BFF_PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`FC BFF request failed: ${response.status} ${response.statusText}`)
  }

  const json: GraphQLResponse<TData> = await response.json()

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }

  return json.data
}
