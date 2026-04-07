import type { NextApiHandler } from 'next'

import discoveryConfig from 'discovery.config'
import fetch from 'isomorphic-unfetch'
import { normalizeSetCookieDomain } from 'src/utils/normalizeSetCookieForRequest'
import { sanitizeHost } from 'src/utils/utilities'

const VTEX_REFRESH_PATH = '/api/vtexid/refreshtoken/webstore'

function getSetCookieValuesFromResponse(response: Response): string[] {
  const headers = response.headers as Headers & {
    getSetCookie?: () => string[]
  }
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie()
  }
  const single = response.headers.get('set-cookie')
  return single ? [single] : []
}

const handler: NextApiHandler = async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).end()
    return
  }

  if (!discoveryConfig.experimental?.refreshToken) {
    response.status(404).end()
    return
  }

  const cookieHeader = request.headers.cookie
  if (!cookieHeader) {
    console.error('[fs/refresh-token] missing Cookie header')
    response.status(401).json({ status: 'Error' })
    return
  }

  const url = `${discoveryConfig.storeUrl}${VTEX_REFRESH_PATH}`

  try {
    const vtexRes = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: cookieHeader,
        Host: `${sanitizeHost(discoveryConfig.storeUrl)}`,
      },
      body: JSON.stringify({}),
    })

    const text = await vtexRes.text()
    let data: Record<string, unknown>
    try {
      data = text ? (JSON.parse(text) as Record<string, unknown>) : {}
    } catch {
      console.error('[fs/refresh-token] invalid JSON body', text.slice(0, 500))
      response.status(500).json({ status: 'Error' })
      return
    }

    const setCookies = getSetCookieValuesFromResponse(vtexRes).map((c) =>
      normalizeSetCookieDomain({ request, setCookie: c })
    )
    if (setCookies.length > 0) {
      response.setHeader('set-cookie', setCookies)
    }

    if (vtexRes.status !== 200) {
      console.error(
        '[fs/refresh-token] VTEX non-200',
        vtexRes.status,
        text.slice(0, 500)
      )
      response
        .status(vtexRes.status === 401 ? 401 : 500)
        .json(data ?? { status: 'Error' })
      return
    }

    response.status(200).json(data)
  } catch (err) {
    console.error('[fs/refresh-token] proxy error', err)
    response.status(500).end()
  }
}

export default handler
