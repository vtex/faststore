import type { NextApiHandler, NextApiRequest } from 'next'

const BFF_URL = 'http://localhost:3001/graphql'

/**
 * Proxies GraphQL requests to the FastCheckout BFF.
 * Forwards cookies for session tracking and proxies set-cookie headers back.
 */
const handler: NextApiHandler = async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).end()
    return
  }

  try {
    const bffResponse = await fetch(BFF_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.cookie && { cookie: request.headers.cookie }),
      },
      body: JSON.stringify(request.body),
    })

    // Proxy set-cookie headers back to the client
    const setCookieHeaders = bffResponse.headers.getSetCookie?.() ?? []
    if (setCookieHeaders.length > 0) {
      response.setHeader('set-cookie', setCookieHeaders)
    }

    response.setHeader('content-type', 'application/json')
    response.setHeader('cache-control', 'no-cache, no-store')

    const data = await bffResponse.json()
    response.status(bffResponse.status).json(data)
  } catch (err) {
    console.error('[checkout-bff] Proxy error:', err)
    response.status(502).json({ errors: [{ message: 'BFF proxy error' }] })
  }
}

export default handler
