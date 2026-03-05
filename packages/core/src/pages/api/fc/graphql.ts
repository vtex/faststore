import { parse } from 'cookie'
import type { NextApiHandler } from 'next'

const FC_BFF_ENDPOINT = 'http://localhost:3001/graphql'

function extractOrderFormId(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null

  const cookies = parse(cookieHeader)
  const raw = cookies['checkout.vtex.com']

  if (!raw) return null

  const match = raw.match(/__ofid=([a-f0-9]+)/)

  return match?.[1] ?? null
}

const handler: NextApiHandler = async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).end()

    return
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const orderFormId = extractOrderFormId(request.headers.cookie)

  if (orderFormId) {
    headers['x-order-form-id'] = orderFormId
  }

  try {
    const upstream = await fetch(FC_BFF_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(request.body),
    })

    const data = await upstream.text()

    response.status(upstream.status)
    response.setHeader('content-type', 'application/json')
    response.setHeader('cache-control', 'no-cache, no-store')
    response.send(data)
  } catch (err) {
    console.error('[FC BFF proxy]', err)
    response.status(502).json({ error: 'Failed to reach FC BFF' })
  }
}

export default handler
