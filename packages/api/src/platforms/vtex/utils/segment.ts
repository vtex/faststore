import { parse } from 'cookie'

import type { Context } from '../index'
import type { SelectedFacet } from './facets'

export type SegmentParams = {
  sc?: string | number
  regionId?: string
  country?: string
  locale?: string
  'zip-code'?: string
  coordinates?: string
  pickupPoint?: string
  deliveryZonesHash?: string
  pickupPointHash?: string
  utmSource?: string
  utmCampaign?: string
  utmiCampaign?: string
  campaigns?: string
  priceTables?: string
  productClusterIds?: string
}

const SHIPPING_FACET_KEYS = new Set([
  'zip-code',
  'pickupPoint',
  'country',
  'coordinates',
  'deliveryZonesHash',
  'pickupPointsHash',
])

const QUERY_PARAM_FACET_KEYS = new Set(['productClusterIds'])

/**
 * Reads and decodes the `vtex_segment` cookie. Does not create a segment.
 * Returns an empty object when the cookie is absent or invalid.
 */
export function parseSegmentCookie(
  cookieHeader?: string
): Record<string, unknown> {
  if (!cookieHeader) {
    return {}
  }

  try {
    const cookies = parse(cookieHeader)
    const segmentToken = cookies.vtex_segment

    if (!segmentToken) {
      return {}
    }

    const decoded = Buffer.from(segmentToken, 'base64').toString('utf-8')

    return JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return {}
  }
}

/**
 * Extracts segment-derived query params and extra path facets.
 * Parses the segment `facets` string to separate shipping/geo keys (sent as query params)
 * from general facets (returned as extraFacets for path concatenation).
 */
export function extractSegmentData(segment: Record<string, unknown>): {
  segmentParams: SegmentParams
  extraFacets: SelectedFacet[]
} {
  const shipping: Record<string, string> = {}
  const queryParams: Record<string, string> = {}
  const extraFacetsResult: SelectedFacet[] = []

  if (typeof segment.facets === 'string' && segment.facets) {
    const facetsStr = segment.facets

    for (const pair of facetsStr.split(';')) {
      const eqIdx = pair.indexOf('=')

      if (eqIdx < 0) continue

      const key = pair.slice(0, eqIdx)
      const value = pair.slice(eqIdx + 1)

      if (!key || !value) continue

      if (SHIPPING_FACET_KEYS.has(key)) {
        shipping[key] = value
      } else if (QUERY_PARAM_FACET_KEYS.has(key)) {
        queryParams[key] = value
      } else {
        extraFacetsResult.push({ key, value })
      }
    }
  }

  return {
    segmentParams: {
      sc: segment.channel as string | number | undefined,
      regionId: segment.regionId as string | undefined,
      country: (segment.countryCode as string | undefined) ?? shipping.country,
      locale: segment.cultureInfo as string | undefined,
      'zip-code': shipping['zip-code'],
      coordinates: shipping.coordinates,
      pickupPoint: shipping.pickupPoint,
      deliveryZonesHash: shipping.deliveryZonesHash,
      pickupPointHash: shipping.pickupPointsHash,
      utmSource: (segment.utm_source as string | undefined) ?? undefined,
      utmCampaign: (segment.utm_campaign as string | undefined) ?? undefined,
      utmiCampaign: (segment.utmi_campaign as string | undefined) ?? undefined,
      campaigns:
        typeof segment.campaigns === 'string' ? segment.campaigns : undefined,
      priceTables: (segment.priceTables as string | undefined) ?? undefined,
      productClusterIds: queryParams.productClusterIds,
    },
    extraFacets: extraFacetsResult,
  }
}

function getRegionIdFromChannel(ctx: Context): string | undefined {
  const { regionId, seller } = ctx.storage.channel
  const sellerRegionId = seller
    ? Buffer.from(`SW#${seller}`).toString('base64')
    : undefined

  return sellerRegionId ?? (regionId || undefined)
}

export function getSegmentLocale(ctx: Context): string {
  const segment = parseSegmentCookie(ctx.headers?.cookie)

  return (segment.cultureInfo as string | undefined) ?? ctx.storage.locale
}

export function buildSegmentParams(ctx: Context): {
  segmentParams: SegmentParams
  extraFacets: SelectedFacet[]
} {
  const segment = parseSegmentCookie(ctx.headers?.cookie)
  const { segmentParams, extraFacets } = extractSegmentData(segment)

  const sc = segmentParams.sc ?? ctx.storage.channel.salesChannel
  const regionId = segmentParams.regionId ?? getRegionIdFromChannel(ctx)
  const locale = getSegmentLocale(ctx)

  return {
    segmentParams: {
      ...segmentParams,
      ...(sc ? { sc } : {}),
      ...(regionId ? { regionId } : {}),
      locale,
    },
    extraFacets,
  }
}

export function appendSegmentParams(
  params: URLSearchParams,
  segmentParams: SegmentParams
) {
  const entries: Array<[string, string | number | undefined]> = [
    ['sc', segmentParams.sc],
    ['regionId', segmentParams.regionId],
    ['country', segmentParams.country],
    ['locale', segmentParams.locale],
    ['zip-code', segmentParams['zip-code']],
    ['coordinates', segmentParams.coordinates],
    ['pickupPoint', segmentParams.pickupPoint],
    ['deliveryZonesHash', segmentParams.deliveryZonesHash],
    ['pickupPointHash', segmentParams.pickupPointHash],
    ['utmSource', segmentParams.utmSource],
    ['utmCampaign', segmentParams.utmCampaign],
    ['utmiCampaign', segmentParams.utmiCampaign],
    ['campaigns', segmentParams.campaigns],
    ['priceTables', segmentParams.priceTables],
    ['productClusterId', segmentParams.productClusterIds],
  ]

  for (const [key, value] of entries) {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value))
    }
  }
}
