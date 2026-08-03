/**
 * Hostnames that represent a local development environment.
 *
 * These are the only hosts where the FastStore app skips the refresh-token
 * flow so developers can drive the app with a manually injected
 * `VtexIdclientAutCookie_<account>` cookie regardless of feature flags.
 */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1'])

/**
 * Returns `true` when the given hostname corresponds to a local development
 * environment (`localhost` / `127.0.0.1`).
 *
 * Refresh-token and other production-only flows MUST be bypassed on these
 * hostnames so that developers can test logged-in scenarios with manually
 * injected cookies, independent of any experimental flag.
 *
 * The input MUST be a bare hostname (no port). Use {@link getRequestHostname}
 * on server-side request headers before calling this helper.
 */
export function isLocalHost(hostname: string | null | undefined): boolean {
  if (!hostname) return false
  return LOCAL_HOSTNAMES.has(hostname.toLowerCase())
}

/**
 * Browser-side wrapper that reads `window.location.hostname`. Returns `false`
 * when `window` is not available (SSR/Node).
 */
export function isLocalHostBrowser(): boolean {
  if (typeof window === 'undefined') return false
  return isLocalHost(window.location.hostname)
}
