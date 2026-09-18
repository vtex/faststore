import { parse } from 'cookie'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import storeConfig from 'discovery.config'
import { expireCookieServer, getCookieDomains } from 'src/utils/clearCookies'
import { getRequestHostname } from 'src/utils/getRequestHostname'

/**
 * Cookies holding the checkout orderForm of the previous commercial context.
 * Both are `HttpOnly`, so they are unreachable from `document.cookie` and can
 * only be expired from the server (B2BTEAM-3827).
 */
const ORDER_FORM_COOKIES = [
  'checkout.vtex.com',
  'CheckoutOrderFormOwnership',
] as const

const SWITCH_PROPERTIES_TIMEOUT_MS = 30_000
const DEFAULT_AUTH_COOKIE_MAX_AGE = 86_400

type VtexAuthCookie = {
  Name: string
  Value: string
}

/** Untrusted upstream payload: every field is validated before use. */
type SwitchPropertiesResponse = {
  authStatus?: string
  expiresIn?: unknown
  authCookie?: VtexAuthCookie | null
  accountAuthCookie?: VtexAuthCookie | null
}

export type SwitchContractResponse = {
  success: boolean
  error?: string
}

const isAuthCookie = (cookie: unknown): cookie is VtexAuthCookie => {
  const candidate = cookie as VtexAuthCookie | null

  return Boolean(candidate?.Name?.trim() && candidate?.Value)
}

const isSecureRequest = (request: NextApiRequest): boolean => {
  const forwarded = request.headers['x-forwarded-proto']
  const proto = Array.isArray(forwarded) ? forwarded[0] : forwarded

  if (proto) {
    return proto.split(',')[0].trim() === 'https'
  }

  const hostname = getRequestHostname(request.headers.host)

  return hostname !== 'localhost' && hostname !== '127.0.0.1'
}

/**
 * A non-positive `expiresIn` would turn into `Max-Age=0`, which expires the
 * credential the response is supposed to install — logging the buyer out while
 * the route reports success. Anything that is not a positive integer falls back
 * to the default.
 */
const resolveMaxAge = (expiresIn: unknown): number =>
  typeof expiresIn === 'number' && Number.isInteger(expiresIn) && expiresIn > 0
    ? expiresIn
    : DEFAULT_AUTH_COOKIE_MAX_AGE

/**
 * Mirrors the attributes the storefront used to write via `document.cookie`.
 * `HttpOnly` is deliberately left out: the cookie lives on a domain shared
 * with VTEX's own checkout, so hardening it is a separate, explicitly tested
 * change.
 */
const buildAuthCookies = (
  payload: SwitchPropertiesResponse,
  secure: boolean
): string[] => {
  const maxAge = resolveMaxAge(payload.expiresIn)
  const secureAttr = secure ? '; Secure' : ''

  return [payload.authCookie, payload.accountAuthCookie]
    .filter(isAuthCookie)
    .map(
      (cookie) =>
        `${cookie.Name}=${cookie.Value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureAttr}`
    )
}

const buildOrderFormExpiryCookies = (request: NextApiRequest): string[] => {
  const hostname = getRequestHostname(request.headers.host)
  const domains = hostname ? getCookieDomains(hostname) : [undefined]
  const cookies = parse(request.headers.cookie ?? '')

  return ORDER_FORM_COOKIES.filter((name) => cookies[name]).flatMap((name) =>
    domains.map((domain) => expireCookieServer({ name, path: '/', domain }))
  )
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

    response.setHeader('Set-Cookie', [
      ...buildAuthCookies(payload, isSecureRequest(request)),
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
