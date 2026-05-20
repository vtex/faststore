import type { GraphqlContext } from '../index'

/**
 * Viewer-location headers that CloudFront can inject on requests forwarded
 * to the origin when the corresponding origin request policy is enabled.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/adding-cloudfront-headers.html#cloudfront-headers-viewer-location
 */
export const CLOUDFRONT_VIEWER_LOCATION_HEADERS = [
  'CloudFront-Viewer-Address',
  'CloudFront-Viewer-ASN',
  'CloudFront-Viewer-City',
  'CloudFront-Viewer-Country',
  'CloudFront-Viewer-Country-Name',
  'CloudFront-Viewer-Country-Region',
  'CloudFront-Viewer-Country-Region-Name',
  'CloudFront-Viewer-Latitude',
  'CloudFront-Viewer-Longitude',
  'CloudFront-Viewer-Metro-Code',
  'CloudFront-Viewer-Postal-Code',
  'CloudFront-Viewer-Time-Zone',
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
