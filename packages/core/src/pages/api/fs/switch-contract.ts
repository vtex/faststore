import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import storeConfig from 'discovery.config'
import {
  buildAuthCookies,
  buildOrderFormExpiryCookies,
  isAuthCookie,
  isSecureRequest,
  relayRefreshTokenCookies,
  resolveAuthCookieDomain,
  type SwitchPropertiesResponse,
} from 'src/utils/authCookies'

const SWITCH_PROPERTIES_TIMEOUT_MS = 30_000

export type SwitchContractResponse = {
  success: boolean
  error?: string
}

/**
 * Switches the buyer's active contract and drops the previous contract's
 * checkout orderForm in a single response.
 *
 * Relays to VTEX Identity server-side, forwarding the buyer cookie as the only
 * credential — no app keys involved, same as `commerce.storeFront`. On success
 * the new auth cookie and the orderForm expiry travel in the same `Set-Cookie`
 * batch, so the browser can never end up authenticated as the new contract
 * while still carrying the old contract's orderForm. On any failure nothing is
 * emitted at all and the previous contract stays active.
 */
const handler: NextApiHandler<SwitchContractResponse> = async (
  request: NextApiRequest,
  response: NextApiResponse<SwitchContractResponse>
) => {
  if (request.method !== 'POST') {
    response.status(405).end()
    return
  }

  const { contractId } = request.body ?? {}

  if (!contractId || typeof contractId !== 'string') {
    response
      .status(400)
      .json({ success: false, error: 'contractId is required' })
    return
  }

  const account = storeConfig.api.storeId
  const an = encodeURIComponent(account)
  const url = `https://${account}.myvtex.com/api/authenticator/storefront/credential/switch-properties?an=${an}`

  try {
    const switchResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.cookie ?? '',
      },
      body: JSON.stringify({ properties: { customerId: contractId } }),
      signal: AbortSignal.timeout(SWITCH_PROPERTIES_TIMEOUT_MS),
      // A redirect is never a successful switch, and following one would carry
      // the buyer's cookie to whatever target the upstream names (CVE-2023-45143
      // on Node < 20.8.1). Fail closed instead.
      redirect: 'error',
    })

    if (!switchResponse.ok) {
      const unauthorized =
        switchResponse.status === 401 || switchResponse.status === 403

      response
        .status(unauthorized ? 401 : 502)
        .json({ success: false, error: 'Failed to switch contract' })
      return
    }

    const payload = (await switchResponse.json()) as SwitchPropertiesResponse

    if (
      payload.authStatus?.toLowerCase() !== 'success' ||
      !isAuthCookie(payload.authCookie)
    ) {
      response
        .status(502)
        .json({ success: false, error: 'Contract switch was not successful' })
      return
    }

    const domain = resolveAuthCookieDomain(request)

    response.setHeader('Set-Cookie', [
      ...buildAuthCookies(payload, domain, isSecureRequest(request)),
      ...relayRefreshTokenCookies(switchResponse.headers, domain),
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
      'switch-contract: upstream failure',
      error instanceof Error ? error.name : 'unknown'
    )

    response
      .status(timedOut ? 504 : 502)
      .json({ success: false, error: 'Failed to switch contract' })
  }
}

export default handler
