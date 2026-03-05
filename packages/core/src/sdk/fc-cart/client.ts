const FC_BFF_URL =
  process.env.NEXT_PUBLIC_FC_BFF_URL ?? 'http://localhost:3001'
const GRAPHQL_ENDPOINT = `${FC_BFF_URL}/graphql`

function getOrderFormId(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('checkout.vtex.com='))
  if (!match) return null
  return match.split('=')[1] ?? null
}

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

export async function fcGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const orderFormId = getOrderFormId()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-fastcheckout-user-date-time': new Date().toISOString(),
  }

  if (orderFormId) {
    headers['x-order-form-id'] = orderFormId
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ query, variables }),
  })

  let json: GraphQLResponse<T>

  try {
    json = await response.json()
  } catch {
    throw new Error(`FC BFF request failed: ${response.status}`)
  }

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }

  if (!json.data) {
    throw new Error('FC BFF returned no data')
  }

  return json.data
}
