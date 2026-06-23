import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import storeConfig from 'discovery.config'

import type { UnlockResponse } from '../../../../utils/unlockResponse'
import {
  sessionUrl,
  passwordProtectionTimeouts,
} from '../../../../server/password-protection/webops-api'
import {
  COOKIE_NAME,
  TOKEN_TTL_SECONDS,
} from 'src/server/password-protection-service'

interface WebOpsSessionPayload {
  valid: boolean
  token?: string
}

const isSafeReturnToPath = (value: string): boolean => {
  return value.startsWith('/') && !value.startsWith('//')
}

const isWebOpsSessionPayload = (
  data: unknown
): data is WebOpsSessionPayload => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return false
  }

  const payload = data as Record<string, unknown>

  return (
    typeof payload.valid === 'boolean' &&
    (payload.token === undefined || typeof payload.token === 'string')
  )
}

const handler: NextApiHandler<UnlockResponse> = async (
  request: NextApiRequest,
  response: NextApiResponse<UnlockResponse>
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

    const webopsResponse = await fetch(sessionUrl(), {
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

    const data: unknown = await webopsResponse.json()

    if (!isWebOpsSessionPayload(data)) {
      response.status(500).json({
        success: false,
        error: 'Internal server error',
      })
      return
    }

    if (data.valid && data.token) {
      const returnTo =
        typeof request.query.returnTo === 'string'
          ? request.query.returnTo
          : '/'
      const sanitizedReturnTo = isSafeReturnToPath(returnTo) ? returnTo : '/'

      response.setHeader('Set-Cookie', [
        `${COOKIE_NAME}=${data.token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${TOKEN_TTL_SECONDS}`,
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
