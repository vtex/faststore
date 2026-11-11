import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import storeConfig from 'discovery.config'
import {
  buildAuthCookies,
  buildOrderFormExpiryCookies,
  isSecureRequest,
  resolveAuthCookieDomain,
} from 'src/utils/authCookies'

const DELEGATION_EXCHANGE_TIMEOUT_MS = 30_000
const TOKEN_EXCHANGE_GRANT_TYPE =
  'urn:ietf:params:oauth:grant-type:token-exchange'

/** Untrusted upstream payload: every field is validated before use. */
type DelegationExchangeResponse = {
  accessToken?: unknown
  tokenType?: unknown
  expiresIn?: unknown
}

export type DelegationExchangeResult = {
  success: boolean
  error?: string
}

/**
 * Starts an impersonation session: the Delegate swaps their own storefront
 * token for one that carries the Original Shopper as the effective user.
 *
 * Relays to VTEX Identity server-side, forwarding the buyer cookie as the only
 * credential. Identity validates the delegation (not revoked, inside its
 * period, same organization, token owner is the Delegate) and rejects nested
 * impersonation, so none of that is re-implemented here. On success the new
 * auth cookie and the orderForm expiry travel in the same `Set-Cookie` batch,
 * so the browser never holds the impersonated credential together with the
 * Delegate's orderForm. On any failure nothing is emitted and the current
 * session stays as it was.
 */
const handler: NextApiHandler<DelegationExchangeResult> = async (
  request: NextApiRequest,
  response: NextApiResponse<DelegationExchangeResult>
) => {
  if (request.method !== 'POST') {
    response.status(405).end()
    return
  }

  const { originalUserId, delegationId } = request.body ?? {}

  if (
    !originalUserId ||
    typeof originalUserId !== 'string' ||
    !delegationId ||
    typeof delegationId !== 'string'
  ) {
    response.status(400).json({
      success: false,
      error: 'originalUserId and delegationId are required',
    })
    return
  }

  const account = storeConfig.api.storeId
  const an = encodeURIComponent(account)
  const url = `https://${account}.myvtex.com/api/authenticator/v1/storefront/token/delegation/exchange?an=${an}`

  try {
    const exchangeResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.cookie ?? '',
      },
      body: JSON.stringify({
        grant_type: TOKEN_EXCHANGE_GRANT_TYPE,
        originalUserId,
        delegationId,
      }),
      signal: AbortSignal.timeout(DELEGATION_EXCHANGE_TIMEOUT_MS),
      // A redirect is never a successful exchange, and following one would
      // carry the buyer's cookie to whatever target the upstream names.
      redirect: 'error',
    })

    if (!exchangeResponse.ok) {
      const unauthorized =
        exchangeResponse.status === 401 || exchangeResponse.status === 403

      response.status(unauthorized ? 403 : 502).json({
        success: false,
        error: 'Failed to start the delegated session',
      })
      return
    }

    const payload =
      (await exchangeResponse.json()) as DelegationExchangeResponse

    if (typeof payload.accessToken !== 'string' || !payload.accessToken) {
      response.status(502).json({
        success: false,
        error: 'Delegated session was not issued',
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

    // Only the error name is logged: the request and response carry the buyer's
    // credentials.
    console.error(
      'delegation-exchange: upstream failure',
      error instanceof Error ? error.name : 'unknown'
    )

    response.status(timedOut ? 504 : 502).json({
      success: false,
      error: 'Failed to start the delegated session',
    })
  }
}

export default handler
