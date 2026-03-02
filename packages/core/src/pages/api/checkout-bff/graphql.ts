import type { NextApiHandler } from 'next'

import discoveryConfig from 'discovery.config'

const BFF_TARGET_HOST = (() => {
  const account =
    (discoveryConfig as Record<string, string>).account ?? 'storeframework'

  return `https://${account}.vtexcommercestable.com.br`
})()

const handler: NextApiHandler = async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).end()
    return
  }

  try {
    const targetUrl = `${BFF_TARGET_HOST}/api/checkout-bff/graphql`

    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept:
        'application/graphql-response+json; charset=utf-8, application/json; charset=utf-8',
    }

    const orderFormId = request.headers['x-order-form-id']

    if (orderFormId && typeof orderFormId === 'string') {
      forwardHeaders['x-order-form-id'] = orderFormId
    }

    const userDateTime = request.headers['x-fastcheckout-user-date-time']

    if (userDateTime && typeof userDateTime === 'string') {
      forwardHeaders['x-fastcheckout-user-date-time'] = userDateTime
    }

    if (request.headers.cookie) {
      forwardHeaders.cookie = request.headers.cookie
    }

    const bffResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: forwardHeaders,
      body: JSON.stringify(request.body),
    })

    const setCookies = bffResponse.headers.get('set-cookie')

    if (setCookies) {
      response.setHeader('set-cookie', setCookies)
    }

    response.setHeader('content-type', 'application/json')
    response.setHeader('cache-control', 'no-cache, no-store')

    const data = await bffResponse.text()

    response.status(bffResponse.status).send(data)
  } catch (err) {
    console.error('Checkout BFF proxy error:', err)
    response.status(502).json({ error: 'Bad Gateway' })
  }
}

export default handler
