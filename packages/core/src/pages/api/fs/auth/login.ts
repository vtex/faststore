import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import storeConfig from 'discovery.config'

const WEBOPS_API_URL =
  process.env.WEBOPS_API_URL || 'https://faststore.vtex.com'
const COOKIE_NAME = '__fs_auth_token'
const TOKEN_TTL_SECONDS = 10 * 60

const handler: NextApiHandler = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  if (request.method !== 'POST') {
    response.status(405).end()
    return
  }

  const storeId = storeConfig.api.storeId

  try {
    const { password } = request.body ?? {}

    if (!password || typeof password !== 'string') {
      response.status(400).json({
        success: false,
        error: 'Password is required',
      })
      return
    }

    const webopsResponse = await fetch(
      `${WEBOPS_API_URL}/api/v1/password-protection/session`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, password }),
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!webopsResponse.ok) {
      response.status(401).json({
        success: false,
        error: 'Invalid password',
      })
      return
    }

    const data = await webopsResponse.json()

    if (data.valid && data.token) {
      const returnTo =
        typeof request.query.returnTo === 'string'
          ? request.query.returnTo
          : '/'

      response.setHeader('Set-Cookie', [
        `${COOKIE_NAME}=${data.token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${TOKEN_TTL_SECONDS}`,
      ])

      response.status(200).json({
        success: true,
        redirectUrl: returnTo,
      })
    } else {
      response.status(401).json({
        success: false,
        error: 'Invalid password',
      })
    }
  } catch {
    response.status(503).json({
      success: false,
      error: 'Service temporarily unavailable',
    })
  }
}

export default handler
