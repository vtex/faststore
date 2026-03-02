interface GraphQLResponse<T = unknown> {
  data: T
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>
}

interface RequestOptions {
  orderFormId?: string
}

/**
 * Uses the local Next.js API proxy to avoid CORS issues.
 * The proxy forwards requests to the fastcheckout BFF.
 */
const BFF_ENDPOINT = '/api/checkout-bff/graphql'

function getOrderFormId(): string | null {
  if (typeof document === 'undefined') return null

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('checkout.vtex.com='))

  if (!match) return null

  const value = match.split('=')[1]
  return value?.replace('__ofid=', '') ?? null
}

export async function bffRequest<TData = unknown, TVars = unknown>(
  query: string,
  variables?: TVars,
  options?: RequestOptions
): Promise<TData> {
  const orderFormId = options?.orderFormId ?? getOrderFormId()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept:
      'application/graphql-response+json; charset=utf-8, application/json; charset=utf-8',
  }

  if (orderFormId) {
    headers['x-order-form-id'] = orderFormId
  }

  headers['x-fastcheckout-user-date-time'] = new Date().toISOString()

  const response = await fetch(BFF_ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(
      `BFF request failed: ${response.status} ${response.statusText}`
    )
  }

  const json: GraphQLResponse<TData> = await response.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  return json.data
}
