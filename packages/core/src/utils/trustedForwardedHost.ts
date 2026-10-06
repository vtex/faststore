/**
 * An entry starting with "." matches subdomains only; any other entry matches
 * the host itself and its subdomains. Matching is anchored on a label boundary,
 * so "evil-localhost" never matches "localhost".
 */
export function isHostAllowed(host: string, allowList: string[]) {
  const normalizedHost = host.toLowerCase()

  return allowList.some((entry) =>
    entry.startsWith('.')
      ? normalizedHost.endsWith(entry)
      : normalizedHost === entry || normalizedHost.endsWith(`.${entry}`)
  )
}

/**
 * Returns the `x-forwarded-host` value only when exactly one is present.
 *
 * Which hop of a proxy chain is trustworthy is not known here: with several
 * values the leftmost one is whatever the client sent. So a multi-value header
 * (comma-joined by Node, or an array) is ignored and the caller falls back to
 * `host`. A single value still assumes the ingress overwrites the header.
 */
export function singleForwardedHost(
  header: string | string[] | undefined
): string | undefined {
  if (Array.isArray(header)) {
    return header.length === 1 ? singleForwardedHost(header[0]) : undefined
  }

  const value = header?.trim()

  return value && !value.includes(',') ? value : undefined
}
