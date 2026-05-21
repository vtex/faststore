import type { GraphqlContext } from '../index'

/**
 * Subset of CloudFront viewer-location headers that VTEX Intelligent Search
 * consumes. The CDN can emit a broader set (see AWS doc), but IS only honors
 * these four — narrowing the list keeps the PII surface area small and the
 * cache key impact predictable.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/adding-cloudfront-headers.html#cloudfront-headers-viewer-location
 */
export const CLOUDFRONT_VIEWER_LOCATION_HEADERS = [
  'CloudFront-Viewer-Country',
  'CloudFront-Viewer-Latitude',
  'CloudFront-Viewer-Longitude',
  'CloudFront-Viewer-Postal-Code',
] as const

const SENSITIVE_HEADER_NAMES_LOWER = new Set(
  CLOUDFRONT_VIEWER_LOCATION_HEADERS.map((name) => name.toLowerCase())
)

/**
 * Returns the CloudFront viewer-location headers present on the incoming
 * request, keyed by their canonical CloudFront name. Headers that are not
 * present are omitted — no empty or default values are synthesized.
 */
export const getCloudFrontViewerLocationHeaders = (
  headers: GraphqlContext['headers']
): Record<string, string> => {
  if (!headers) {
    return {}
  }

  const incoming = new Headers(headers)
  const forwarded: Record<string, string> = {}

  for (const name of CLOUDFRONT_VIEWER_LOCATION_HEADERS) {
    const value = incoming.get(name)
    if (value !== null) {
      forwarded[name] = value
    }
  }

  return forwarded
}

/**
 * Returns a copy of `headers` with every CloudFront viewer-location header
 * value replaced by '[REDACTED]'. Intended for log statements (e.g. the
 * console.error in fetch.ts on non-OK responses) so PII does not leak into
 * observability sinks. Non-sensitive headers pass through unchanged.
 *
 * Output is always a plain Record<string, string>, with keys normalized to
 * lowercase (a side effect of routing through the Headers constructor — this
 * is consistent with how HTTP treats header names and keeps the redaction
 * logic uniform across all HeadersInit input forms).
 */
export const redactCloudFrontViewerLocationHeaders = (
  headers: HeadersInit | undefined
): Record<string, string> | undefined => {
  if (!headers) {
    return headers
  }

  const result: Record<string, string> = {}
  new Headers(headers).forEach((value, key) => {
    // Headers normalizes keys to lowercase, so we can compare directly.
    result[key] = SENSITIVE_HEADER_NAMES_LOWER.has(key) ? '[REDACTED]' : value
  })
  return result
}
