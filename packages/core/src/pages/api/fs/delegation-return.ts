import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import storeConfig from 'discovery.config'
import {
  buildAuthCookies,
  buildOrderFormExpiryCookies,
  isSecureRequest,
  resolveAuthCookieDomain,
} from 'src/utils/authCookies'

const DELEGATION_RETURN_TIMEOUT_MS = 30_000

/**
 * TODO(B2BTEAM-4043): the only piece waiting on Identity. Identity is still
 * building the Return API (the inverse of the token exchange), so its path is
 * not known yet. While this is `null` the route answers 501 and the banner
 * keeps the RFC's temporary workaround (logout and sign in again).
 *
 * When the contract lands, fill the path below (relative to
 * `https://{account}.myvtex.com`) and confirm the three assumptions marked
 * "CONTRACT" further down: request body, response shape and error statuses.
 */
const DELEGATION_RETURN_PATH: string | null = null

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
export const createDelegationReturnHandler =
  (returnPath: string | null): NextApiHandler<DelegationReturnResult> =>
  async (
    request: NextApiRequest,
    response: NextApiResponse<DelegationReturnResult>
  ) => {
    if (request.method !== 'POST') {
      response.status(405).end()
      return
    }

    if (!returnPath) {
      response.status(501).json({
        success: false,
        error: 'Return from a delegated session is not available yet',
      })
      return
    }

    const account = storeConfig.api.storeId
    const an = encodeURIComponent(account)
    const url = `https://${account}.myvtex.com${returnPath}?an=${an}`

    try {
      const returnResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: request.headers.cookie ?? '',
        },
        // CONTRACT: assumed to need no body, since the impersonated token already
        // identifies the Delegate through its `act` claim.
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(DELEGATION_RETURN_TIMEOUT_MS),
        // A redirect is never a successful return, and following one would carry
        // the cookie to whatever target the upstream names.
        redirect: 'error',
      })

      if (!returnResponse.ok) {
        // CONTRACT: error statuses (expired token, revoked delegation) to be
        // confirmed. Anything but 401/403 is treated as an upstream failure.
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

export default createDelegationReturnHandler(DELEGATION_RETURN_PATH)
