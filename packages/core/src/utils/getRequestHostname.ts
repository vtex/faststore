/**
 * Extracts and normalizes a hostname from a raw `Host` header value (or any
 * "host:port" string).
 *
 * Normalization rules:
 * - Strips the port segment (e.g. `"store.com:443"` -> `"store.com"`)
 * - Lowercases the result for case-insensitive comparisons
 * - Trims surrounding whitespace
 * - Returns `null` when the input is missing, empty, or whitespace-only
 */
export function getRequestHostname(
  host: string | null | undefined
): string | null {
  const trimmed = host?.trim()

  if (!trimmed) {
    return null
  }

  try {
    return new URL(`https://${trimmed}`).hostname.toLowerCase()
  } catch {
    return trimmed.split(':')[0].toLowerCase()
  }
}
