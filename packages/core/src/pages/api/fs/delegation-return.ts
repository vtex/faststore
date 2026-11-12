import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import storeConfig from 'discovery.config'
import {
  buildAuthCookies,
  buildOrderFormExpiryCookies,
  isSecureRequest,
  resolveAuthCookieDomain,
} from 'src/utils/authCookies'

const DELEGATION_RETURN_TIMEOUT_MS = 30_000

const DELEGATION_RETURN_PATH =
  '/api/authenticator/v1/storefront/token/delegation/return'

/** Untrusted upstream payload: every field is validated before use. */
type DelegationReturnResponse = {
  accessToken?: unknown
  tokenType?: unknown
  expiresIn?: unknown
}

export type DelegationReturnResult = {
  success: boolean
  error?: string
}

/**
 * Ends an impersonation session: swaps the impersonated token for the
 * Delegate's own and drops the Original Shopper's checkout orderForm.
 *
 * Same shape as `delegation-exchange`: relay to VTEX Identity server-side with
 * the (impersonated) cookie as the only credential; on success the new auth
 * cookie and the orderForm expiry travel in one `Set-Cookie` batch; on any
 * failure nothing is emitted and the current session stays as it was.
 */
const handler: NextApiHandler<DelegationReturnResult> = async (
  request: NextApiRequest,
  response: NextApiResponse<DelegationReturnResult>
) => {
  if (request.method !== 'POST') {
    response.status(405).end()
    return
  }

  const account = storeConfig.api.storeId
  const an = encodeURIComponent(account)
  const url = `https://${account}.myvtex.com${DELEGATION_RETURN_PATH}?an=${an}`

  try {
    const returnResponse = await fetch(url, {
      method: 'POST',
      headers: {
        cookie: request.headers.cookie ?? '',
      },
      signal: AbortSignal.timeout(DELEGATION_RETURN_TIMEOUT_MS),
      // A redirect is never a successful return, and following one would carry
      // the cookie to whatever target the upstream names.
      redirect: 'error',
    })

    if (!returnResponse.ok) {
      const unauthorized =
        returnResponse.status === 401 || returnResponse.status === 403

      response.status(unauthorized ? 403 : 502).json({
        success: false,
        error: 'Failed to return from the delegated session',
      })
      return
    }

    // CONTRACT: assumed to answer like the exchange (`accessToken`,
    // `expiresIn`); if Identity answers with `Set-Cookie` instead, relay those
    // headers here.
    const payload = (await returnResponse.json()) as DelegationReturnResponse

    if (typeof payload.accessToken !== 'string' || !payload.accessToken) {
      response.status(502).json({
        success: false,
        error: 'Return from the delegated session was not issued',
      })
      return
    }

    const domain = resolveAuthCookieDomain(request)

    response.setHeader('Set-Cookie', [
      ...buildAuthCookies(
        {
          authCookie: {
            Name: `VtexIdclientAutCookie_${account}`,
            Value: payload.accessToken,
          },
          expiresIn: payload.expiresIn,
        },
        domain,
        isSecureRequest(request)
      ),
      ...buildOrderFormExpiryCookies(request),
    ])

    response.status(200).json({ success: true })
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === 'TimeoutError' || error.name === 'AbortError')

    // Only the error name is logged: the request and response carry
    // credentials.
    console.error(
      'delegation-return: upstream failure',
      error instanceof Error ? error.name : 'unknown'
    )

    response.status(timedOut ? 504 : 502).json({
      success: false,
      error: 'Failed to return from the delegated session',
    })
  }
}

export default handler
