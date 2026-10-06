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
 * Node joins repeated headers with ", " (or exposes an array). Only the first
 * value is considered, the one set by the outermost proxy.
 */
export function firstForwardedHost(
  header: string | string[] | undefined
): string | undefined {
  const raw = Array.isArray(header) ? header[0] : header
  const first = raw?.split(',')[0]?.trim()

  return first || undefined
}
