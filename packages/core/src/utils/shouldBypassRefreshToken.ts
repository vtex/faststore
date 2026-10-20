import { isLocalHost } from './isLocalHost'

/**
 * WebOps preview deployments are served under `<preview>.preview.vtex.app`.
 *
 * Only this subdomain is matched: `{account}.vtex.app` is a production default
 * domain and MUST keep the refresh-token flow.
 */
const PREVIEW_HOST_SUFFIX = '.preview.vtex.app'

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
 * on server-side request headers before calling this helper.
 */
export function shouldBypassRefreshToken(
  hostname: string | null | undefined
): boolean {
  if (!hostname) return false
  return (
    isLocalHost(hostname) ||
    hostname.toLowerCase().endsWith(PREVIEW_HOST_SUFFIX)
  )
}

/**
 * Browser-side wrapper that reads `window.location.hostname`. Returns `false`
 * when `window` is not available (SSR/Node).
 */
export function shouldBypassRefreshTokenBrowser(): boolean {
  if (typeof window === 'undefined') return false
  return shouldBypassRefreshToken(window.location.hostname)
}
