import { describe, expect, it } from 'vitest'
import {
  CLOUDFRONT_VIEWER_LOCATION_HEADERS,
  getCloudFrontViewerLocationHeaders,
} from '../../../../../src/platforms/vtex/utils/cloudfrontHeaders'

describe('getCloudFrontViewerLocationHeaders', () => {
  it('returns an empty object when no CloudFront headers are present', () => {
    expect(
      getCloudFrontViewerLocationHeaders({
        host: 'example.com',
        cookie: 'foo=bar',
      })
    ).toEqual({})
  })

  it('returns an empty object when headers is undefined', () => {
    expect(
      getCloudFrontViewerLocationHeaders(
        undefined as unknown as Record<string, string>
      )
    ).toEqual({})
  })

  it('returns only the CloudFront viewer-location headers present on the request', () => {
    const result = getCloudFrontViewerLocationHeaders({
      host: 'example.com',
      'cloudfront-viewer-country': 'BR',
      'cloudfront-viewer-latitude': '-23.55',
      'cloudfront-viewer-postal-code': '01000-000',
      'x-some-other-header': 'ignored',
    })

    expect(result).toEqual({
      'CloudFront-Viewer-Country': 'BR',
      'CloudFront-Viewer-Latitude': '-23.55',
      'CloudFront-Viewer-Postal-Code': '01000-000',
    })
  })

  it('does not include headers that are absent (no empty/default values)', () => {
    const result = getCloudFrontViewerLocationHeaders({
      'cloudfront-viewer-country': 'BR',
    })

    expect(Object.keys(result)).toEqual(['CloudFront-Viewer-Country'])
  })

  it('preserves the canonical CloudFront header casing regardless of input casing', () => {
    const result = getCloudFrontViewerLocationHeaders({
      'CLOUDFRONT-VIEWER-COUNTRY': 'BR',
      'CloudFront-Viewer-Postal-Code': '01000-000',
    })

    expect(result).toEqual({
      'CloudFront-Viewer-Country': 'BR',
      'CloudFront-Viewer-Postal-Code': '01000-000',
    })
  })

  it('ignores CloudFront viewer headers that are outside the IS subset (e.g. City, Time-Zone)', () => {
    const result = getCloudFrontViewerLocationHeaders({
      'cloudfront-viewer-country': 'BR',
      'cloudfront-viewer-city': 'São Paulo',
      'cloudfront-viewer-time-zone': 'America/Sao_Paulo',
      'cloudfront-viewer-address': '203.0.113.1',
    })

    expect(result).toEqual({ 'CloudFront-Viewer-Country': 'BR' })
  })

  it('forwards every documented viewer-location header verbatim when present', () => {
    const incoming = Object.fromEntries(
      CLOUDFRONT_VIEWER_LOCATION_HEADERS.map((name, index) => [
        name.toLowerCase(),
        `value-${index}`,
      ])
    )

    const result = getCloudFrontViewerLocationHeaders(incoming)

    const expected = Object.fromEntries(
      CLOUDFRONT_VIEWER_LOCATION_HEADERS.map((name, index) => [
        name,
        `value-${index}`,
      ])
    )
    expect(result).toEqual(expected)
  })
})
