import { parse } from 'cookie'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { isIP } from 'node:net'

import storeConfig from 'discovery.config'
import { expireCookieServer, getCookieDomains } from 'src/utils/clearCookies'
import { getRequestHostname } from 'src/utils/getRequestHostname'
import {
  HOST_ONLY_COOKIE_HOST_SUFFIXES,
  isCookieSafeHostname,
  isHostAllowed,
  singleForwardedHost,
} from 'src/utils/trustedForwardedHost'

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
 * Uses the forwarded protocol when a proxy sets it, otherwise the connection
 * itself. A non-local hostname alone does not imply https: a `Secure` cookie
 * sent over plain http is dropped by the browser while the route reports
 * success.
 */
const isSecureRequest = (request: NextApiRequest): boolean => {
  const forwarded = request.headers['x-forwarded-proto']
  const proto = Array.isArray(forwarded) ? forwarded[0] : forwarded

  if (proto) {
    return proto.split(',')[0].trim() === 'https'
  }

  const socket = request.socket
  return Boolean(socket && 'encrypted' in socket && socket.encrypted)
}

/**
 * Every parent of `hostname` with at least two labels, closest first:
 * `a.b.store.com` gives `b.store.com` and `store.com`. A parent that is a
 * public suffix (e.g. `com.br`) is rejected by the browser, so expiring a
 * cookie there is a no-op.
 */
const getParentDomains = (hostname: string): string[] => {
  const labels = hostname.split('.')

  return labels
    .slice(1, -1)
    .map((_, index) => labels.slice(index + 1).join('.'))
}

const isHostOnlyCookieHost = (hostname: string | null): boolean =>
  !!hostname && isHostAllowed(hostname, HOST_ONLY_COOKIE_HOST_SUFFIXES)

/**
 * Domain for the auth cookies, or `undefined` to write them host-only.
 *
 * Previews and local hosts stay host-only, the same as the cookies
 * `/api/graphql` relays there: behind the preview ingress `Host` is not the
 * host the browser requested, and a mismatched Domain makes the browser drop
 * the cookie while the route reports success. `x-forwarded-host` only decides
 * that the cookie is host-only; it never chooses the Domain. IP literals and
 * hosts that cannot be written verbatim into the attribute (including a
 * trailing-dot FQDN) are host-only too.
 */
const resolveAuthCookieDomain = (
  request: NextApiRequest
): string | undefined => {
  const hostname = getRequestHostname(request.headers.host)
  const forwardedHost = getRequestHostname(
    singleForwardedHost(request.headers['x-forwarded-host'])
  )

  if (
    !hostname ||
    isHostOnlyCookieHost(hostname) ||
    isHostOnlyCookieHost(forwardedHost) ||
    isIP(hostname) !== 0 ||
    hostname.endsWith('.') ||
    !isCookieSafeHostname(hostname)
  ) {
    return undefined
  }

  return hostname
}

/**
 * Mirrors the attributes VTEX ID uses when it sets these cookies at login and
 * refresh (`Domain=<host>; Path=/; Secure; SameSite=None; HttpOnly`).
 *
 * Browsers tell cookies apart by name, domain and path, and a cookie with a
 * Domain attribute never matches a host-only one. Writing the contract token
 * host-only would sit next to VTEX ID's cookie instead of replacing it, leaving
 * two `VtexIdclientAutCookie_<account>` with different contracts. Each reader
 * then picks a different one. Any host-only copy left by earlier versions is
 * expired in the same batch.
 *
 * VTEX ID's refresh also writes the cookie on the parent domain (e.g.
 * `Domain=store.com` for `www.store.com`), which this response cannot replace
 * without widening the cookie to every sibling host. Those copies are expired
 * instead, so the only auth cookie left holds the switched contract. The next
 * refresh writes the host and parent copies with the same token.
 *
 * The Domain-scoped cookie is always `Secure`, like VTEX ID's, because the
 * forwarded protocol is not reliable behind the CDN. The host-only fallback
 * follows the request protocol so plain-http local hosts keep working.
 */
const buildAuthCookies = (
  payload: SwitchPropertiesResponse,
  domain: string | undefined,
  secure: boolean
): string[] => {
  const staleScopes: Array<string | undefined> = domain
    ? [undefined, ...getParentDomains(domain)]
    : []
  const attributes = [
    domain && `Domain=${domain}`,
    'Path=/',
    `Max-Age=${resolveMaxAge(payload.expiresIn)}`,
    'HttpOnly',
    (domain || secure) && 'Secure',
    `SameSite=${domain ? 'None' : 'Lax'}`,
  ]
    .filter(Boolean)
    .join('; ')

  return [payload.authCookie, payload.accountAuthCookie]
    .filter(isAuthCookie)
    .flatMap((cookie) => [
      ...staleScopes.map((staleDomain) =>
        expireCookieServer({
          name: cookie.Name,
          path: '/',
          domain: staleDomain,
        })
      ),
      `${cookie.Name}=${cookie.Value}; ${attributes}`,
    ])
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
      ...buildAuthCookies(
        payload,
        resolveAuthCookieDomain(request),
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
      'switch-contract: upstream failure',
      error instanceof Error ? error.name : 'unknown'
    )

    response
      .status(timedOut ? 504 : 502)
      .json({ success: false, error: 'Failed to switch contract' })
  }
}

export default handler
