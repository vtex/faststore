/**
 * Hostnames that represent a local development environment.
 */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1'])

/**
 * Returns `true` when the given hostname corresponds to a local development
 * environment (`localhost` / `127.0.0.1`).
 *
 * To decide whether to skip the refresh-token flow, use
 * `shouldBypassRefreshToken`, which also covers WebOps preview hosts.
 *
 * The input MUST be a bare hostname (no port). Use {@link getRequestHostname}
 * on server-side request headers before calling this helper.
 */
export function isLocalHost(hostname: string | null | undefined): boolean {
  if (!hostname) return false
  return LOCAL_HOSTNAMES.has(hostname.toLowerCase())
}
