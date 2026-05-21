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
