import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import storeConfig from 'discovery.config'

import { isSecureAuthCookieForPagesApi } from '../../../../server/password-protection/auth-cookie'
import {
  sessionUrl,
  passwordProtectionTimeouts,
} from '../../../../server/password-protection/webops-api'

const COOKIE_NAME = '__fs_auth_token'
const TOKEN_TTL_SECONDS = 10 * 60

const isSafeReturnToPath = (value: string): boolean => {
  return value.startsWith('/') && !value.startsWith('//')
}

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

    const webopsResponse = await fetch(sessionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId, password }),
      signal: AbortSignal.timeout(passwordProtectionTimeouts.defaultMs),
    })

    if (!webopsResponse.ok) {
      if (webopsResponse.status === 401 || webopsResponse.status === 403) {
        response.status(401).json({
          success: false,
          error: 'Invalid password',
        })
        return
      }

      response.status(503).json({
        success: false,
        error: 'Service temporarily unavailable',
      })
      return
    }

    const data = await webopsResponse.json()

    if (data.valid && data.token) {
      const returnTo =
        typeof request.query.returnTo === 'string'
          ? request.query.returnTo
          : '/'
      const sanitizedReturnTo = isSafeReturnToPath(returnTo) ? returnTo : '/'

      const securePart = isSecureAuthCookieForPagesApi(request)
        ? '; Secure'
        : ''

      response.setHeader('Set-Cookie', [
        `${COOKIE_NAME}=${data.token}; HttpOnly${securePart}; SameSite=Lax; Path=/; Max-Age=${TOKEN_TTL_SECONDS}`,
      ])

      response.status(200).json({
        success: true,
        redirectUrl: sanitizedReturnTo,
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
