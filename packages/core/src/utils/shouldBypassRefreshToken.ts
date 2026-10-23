import { getRequestHostname } from './getRequestHostname'
import { isLocalHost } from './isLocalHost'
import { isHostAllowed, singleForwardedHost } from './trustedForwardedHost'

/**
 * WebOps preview deployments are served under `<preview>.preview.vtex.app`.
 *
 * Only this subdomain is matched: `{account}.vtex.app` is a production default
 * domain and MUST keep the refresh-token flow.
 */
const PREVIEW_HOST_SUFFIXES = ['.preview.vtex.app']

/**
 * Returns `true` when the refresh-token flow must be skipped for the given
 * hostname: local development (`localhost` / `127.0.0.1`) and WebOps previews.
 *
 * Neither environment proxies VTEX ID, so `/api/vtexid/refreshtoken/webstore`
 * always fails there and the resulting logout wipes a manually injected
 * `VtexIdclientAutCookie_<account>` cookie. Skipping the flow lets developers
 * test logged-in scenarios with that cookie alone.
 *
 * The input MUST be a bare hostname (no port). Use {@link getRequestHostname}
 * on server-side request headers before calling this helper. A trailing dot
 * (fully qualified name) is ignored.
 */
export function shouldBypassRefreshToken(
  hostname: string | null | undefined
): boolean {
  if (!hostname) return false
  const normalizedHostname = hostname.toLowerCase().replace(/\.$/, '')
  return (
    isLocalHost(normalizedHostname) ||
    isHostAllowed(normalizedHostname, PREVIEW_HOST_SUFFIXES)
  )
}

/**
 * Server-side check from the request headers. Behind the WebOps preview
 * ingress the browser host arrives in `x-forwarded-host` rather than `Host`
 * (see `normalizeSetCookieDomain` in `pages/api/graphql.ts`), so both are
 * checked. Both are client-controlled: a forged value only skips the forced
 * refresh, which grants nothing since the JWT is still validated upstream.
 */
export function shouldBypassRefreshTokenForRequest(headers: {
  host?: string
  'x-forwarded-host'?: string | string[]
}): boolean {
  return (
    shouldBypassRefreshToken(getRequestHostname(headers.host)) ||
    shouldBypassRefreshToken(
      getRequestHostname(singleForwardedHost(headers['x-forwarded-host']))
    )
  )
}

/**
 * Browser-side wrapper that reads `window.location.hostname`. Returns `false`
 * when `window` is not available (SSR/Node).
 */
export function shouldBypassRefreshTokenBrowser(): boolean {
  if (globalThis.window === undefined) return false
  return shouldBypassRefreshToken(globalThis.window.location.hostname)
}
