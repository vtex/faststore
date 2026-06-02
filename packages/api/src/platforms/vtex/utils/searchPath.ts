import type { SegmentParams } from './segment'
import type { SelectedFacet } from './facets'

const encodeSafeURI = (uri: string) => encodeURI(decodeURI(uri))

const removeDiacriticsFromURL = (url: string) =>
  encodeURIComponent(
    decodeURIComponent(url)
      .normalize('NFD')
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: After NFD normalization, combining marks are separated and can be matched individually
      .replace(/[\u0300-\u036f]/g, '')
  )

const PICKUP_IN_POINT_SUFFIX_RE = /^pickup-in-point-(.+)$/

function extractPickupPointIdFromShippingFacetValue(
  value: string
): string | undefined {
  const match = PICKUP_IN_POINT_SUFFIX_RE.exec(value)

  return match?.[1]
}

export function extractPickupPointIdFromPathShippingFacet(
  selectedFacetsFromPath: SelectedFacet[]
): string | undefined {
  const shipping = selectedFacetsFromPath.find((f) => f.key === 'shipping')
  const rawId = shipping
    ? extractPickupPointIdFromShippingFacetValue(shipping.value)
    : undefined

  if (rawId === undefined) {
    return undefined
  }

  try {
    return decodeURIComponent(rawId)
  } catch {
    return rawId
  }
}

export function mergeSegmentParamsWithPickupFromPath(
  segmentParams: SegmentParams | undefined,
  selectedFacetsFromPath: SelectedFacet[]
): SegmentParams | undefined {
  const pathPickupId = extractPickupPointIdFromPathShippingFacet(
    selectedFacetsFromPath
  )

  if (pathPickupId === undefined) {
    return segmentParams
  }

  return {
    ...(segmentParams ?? {}),
    pickupPoint: pathPickupId,
  }
}

function normalizePickupInPointShippingFacets(
  selectedFacets: SelectedFacet[]
): SelectedFacet[] {
  return selectedFacets.map((facet) => {
    if (facet.key !== 'shipping') {
      return facet
    }

    const id = extractPickupPointIdFromShippingFacetValue(facet.value)

    if (id === undefined) {
      return facet
    }

    return { ...facet, value: 'pickup-in-point' }
  })
}

export function concatSelectedFacets(
  selectedFacets: SelectedFacet[],
  selectedFacetsFromSegment: SelectedFacet[]
): SelectedFacet[] {
  let result = [...selectedFacets]
  const hasShipping = result.some((f) => f.key === 'shipping')

  for (const facet of selectedFacetsFromSegment) {
    if (!hasShipping || facet.key !== 'shipping') {
      result.push(facet)
    }
  }

  if (result.some((f) => f.key === 'shipping' && f.value === 'ignore')) {
    result = result.filter((f) => f.key !== 'shipping')
  }

  return normalizePickupInPointShippingFacets(result)
}

export const buildAttributePath = (selectedFacets: SelectedFacet[]) => {
  return selectedFacets.reduce((attributePath, facet) => {
    let { key, value } = facet

    if (key === 'priceRange') {
      key = 'price'
      value = value.replace(' TO ', ':')
    }

    return key !== 'ft'
      ? `${attributePath}${encodeSafeURI(key)}/${removeDiacriticsFromURL(encodeSafeURI(value)).replace(/ |%20/, '-')}/`
      : attributePath
  }, '')
}
