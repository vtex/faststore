const BFF_ENDPOINT = '/api/checkout-bff'

export interface BffGraphQLResponse<D = any> {
  data: D
  errors?: Array<{ message: string; extensions?: any }>
}

/**
 * Sends a raw GraphQL request (query string, not persisted) to the BFF proxy.
 */
export async function bffRequest<Data = unknown, Variables = unknown>(
  query: string,
  variables?: Variables
): Promise<Data> {
  const response = await fetch(BFF_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(
      `BFF request failed: ${response.status} ${response.statusText}`
    )
  }

  const json: BffGraphQLResponse<Data> = await response.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  return json.data
}
