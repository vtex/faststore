import { parse } from 'cookie'

export interface IntelligentSearchFacet {
  key: string
  value: string
}

type FuzzyFacet = {
  key: 'fuzzy'
  value: '0' | '1' | 'auto'
}

type OperatorFacet = {
  key: 'operator'
  value: 'and' | 'or'
}

type SegmentParams = {
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

export type Sort =
  | 'price:desc'
  | 'price:asc'
  | 'orders:desc'
  | 'name:desc'
  | 'name:asc'
  | 'release:desc'
  | 'discount:desc'
  | ''

export type ProductIdentifierField = 'id' | 'slug' | 'ean' | 'reference' | 'sku'

export type IntelligentSearchEndpoint =
  | 'product-search'
  | 'facets'
  | 'catalog-count'
  | 'products'
  | 'search-suggestions'
  | 'top-searches'

export interface IntelligentSearchDefaults {
  salesChannel?: string | number
  regionId?: string
  locale: string
  hideUnavailableItems?: boolean
  simulationBehavior?: 'default' | 'skip' | 'only1P'
  showSponsored?: boolean
}

export interface IntelligentSearchRequestArgs {
  query?: string
  page?: number
  count?: number
  sort?: Sort
  selectedFacets?: IntelligentSearchFacet[]
  showInvisibleItems?: boolean
  hideUnavailableItems?: boolean
  sponsoredCount?: number
  allowRedirect?: boolean
  field?: ProductIdentifierField
  value?: string
}

export interface IntelligentSearchRequestInput {
  endpoint: IntelligentSearchEndpoint
  /** Decoded vtex_segment object (params + extraFacets are extracted internally). */
  segment?: Record<string, unknown>
  defaults?: IntelligentSearchDefaults
  args?: IntelligentSearchRequestArgs
}

export interface IntelligentSearchRequest {
  /** Attribute path segment only (no base URL or endpoint prefix). */
  path: string
  params: URLSearchParams
  toString(): string
}

const FUZZY_KEY = 'fuzzy'
const OPERATOR_KEY = 'operator'
const PICKUP_POINT_KEY = 'pickupPoint'
const SHIPPING_KEY = 'shipping'
const DELIVERY_OPTIONS_KEY = 'delivery-options'
const IN_STOCK_KEY = 'in-stock'
const POLICY_KEY = 'trade-policy'
const REGION_KEY = 'region-id'

const PATH_EXCLUDED_KEYS = new Set([
  POLICY_KEY,
  REGION_KEY,
  FUZZY_KEY,
  OPERATOR_KEY,
  PICKUP_POINT_KEY,
])

const SHIPPING_FACET_KEYS = new Set([
  'zip-code',
  'pickupPoint',
  'country',
  'coordinates',
  'deliveryZonesHash',
  'pickupPointsHash',
])

const QUERY_PARAM_FACET_KEYS = new Set(['productClusterIds'])

const encodeSafeURI = (uri: string) => encodeURI(decodeURI(uri))

const removeDiacriticsFromURL = (url: string) =>
  encodeURIComponent(
    decodeURIComponent(url)
      .normalize('NFD')
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: After NFD normalization, combining marks are separated and can be matched individually
      .replaceAll(/[\u0300-\u036f]/g, '')
  )

const PICKUP_IN_POINT_SUFFIX_RE = /^pickup-in-point-(.+)$/

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

function parseSegmentFacetsString(facetsStr: string): {
  shipping: Record<string, string>
  queryParams: Record<string, string>
  extraFacets: IntelligentSearchFacet[]
} {
  const shipping: Record<string, string> = {}
  const queryParams: Record<string, string> = {}
  const extraFacets: IntelligentSearchFacet[] = []

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
      extraFacets.push({ key, value })
    }
  }

  return { shipping, queryParams, extraFacets }
}

function extractSegmentData(segment: Record<string, unknown>): {
  segmentParams: SegmentParams
  extraFacets: IntelligentSearchFacet[]
} {
  const facetsStr = typeof segment.facets === 'string' ? segment.facets : ''
  const { shipping, queryParams, extraFacets } =
    parseSegmentFacetsString(facetsStr)

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
    extraFacets,
  }
}

function appendSegmentParams(
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

function extractPickupPointIdFromShippingFacetValue(
  value: string
): string | undefined {
  const match = PICKUP_IN_POINT_SUFFIX_RE.exec(value)

  return match?.[1]
}

function extractPickupPointIdFromPathShippingFacet(
  selectedFacetsFromPath: IntelligentSearchFacet[]
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

function mergeSegmentParamsWithPickupFromPath(
  segmentParams: SegmentParams | undefined,
  selectedFacetsFromPath: IntelligentSearchFacet[]
): SegmentParams | undefined {
  const pathPickupId = extractPickupPointIdFromPathShippingFacet(
    selectedFacetsFromPath
  )

  if (pathPickupId === undefined) {
    return segmentParams
  }

  return {
    ...segmentParams,
    pickupPoint: pathPickupId,
  }
}

function normalizePickupInPointShippingFacets(
  selectedFacets: IntelligentSearchFacet[]
): IntelligentSearchFacet[] {
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

function concatSelectedFacets(
  selectedFacets: IntelligentSearchFacet[],
  selectedFacetsFromSegment: IntelligentSearchFacet[]
): IntelligentSearchFacet[] {
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

function buildAttributePath(selectedFacets: IntelligentSearchFacet[]) {
  return selectedFacets.reduce((attributePath, facet) => {
    let { key, value } = facet

    if (key === 'priceRange') {
      key = 'price'
      value = value.replace(' TO ', ':')
    }

    return key === 'ft'
      ? attributePath
      : `${attributePath}${encodeSafeURI(key)}/${removeDiacriticsFromURL(encodeSafeURI(value)).replaceAll(/ |%20/g, '-')}/`
  }, '')
}

const isFuzzyFacet = (facet: IntelligentSearchFacet): facet is FuzzyFacet =>
  facet.key === 'fuzzy' &&
  (facet.value === '0' || facet.value === '1' || facet.value === 'auto')

const isOperatorFacet = (
  facet: IntelligentSearchFacet
): facet is OperatorFacet =>
  facet.key === 'operator' && (facet.value === 'and' || facet.value === 'or')

function resolveSegmentData(
  segment: Record<string, unknown> | undefined,
  defaults: IntelligentSearchDefaults | undefined
): { segmentParams: SegmentParams; extraFacets: IntelligentSearchFacet[] } {
  const { segmentParams, extraFacets } = extractSegmentData(segment ?? {})

  // Server-provided defaults are authoritative for sales channel/region: the
  // raw `vtex_segment` cookie is client-supplied base64 JSON and must not be
  // able to override the trusted server context. Only fall back to the cookie
  // values when no default is provided.
  const sc = defaults?.salesChannel ?? segmentParams.sc
  const regionId = defaults?.regionId ?? segmentParams.regionId
  const locale = defaults?.locale ?? segmentParams.locale ?? ''

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

function preparePathFacets(
  facets: IntelligentSearchFacet[],
  extraFacets: IntelligentSearchFacet[]
): IntelligentSearchFacet[] {
  const pathFacets = facets.filter(({ key }) => !PATH_EXCLUDED_KEYS.has(key))

  const shippingFacet =
    facets.find(
      ({ key, value }) =>
        key === SHIPPING_KEY && value !== 'all-delivery-methods'
    ) ?? null

  const deliveryOptionsFacet =
    facets.find(
      ({ key, value }) =>
        key === DELIVERY_OPTIONS_KEY && value !== 'all-delivery-options'
    ) ?? null

  const withShippingFacets = [...pathFacets]

  // `pathFacets` may already contain the shipping/delivery-options facets, so
  // only push them when they are not already present to avoid duplicated path
  // segments like `shipping/delivery/shipping/delivery/`.
  const hasShippingInPath = withShippingFacets.some(
    ({ key }) => key === SHIPPING_KEY
  )
  const hasDeliveryOptionsInPath = withShippingFacets.some(
    ({ key }) => key === DELIVERY_OPTIONS_KEY
  )

  if (shippingFacet !== null && !hasShippingInPath) {
    withShippingFacets.push(shippingFacet)
  }

  if (deliveryOptionsFacet !== null && !hasDeliveryOptionsInPath) {
    withShippingFacets.push(deliveryOptionsFacet)
  }

  return concatSelectedFacets(withShippingFacets, extraFacets)
}

function addSearchParamsFacets(
  facets: IntelligentSearchFacet[],
  params: URLSearchParams
) {
  const fuzzyFacet = facets.find(({ key }) => key === FUZZY_KEY) ?? null
  const operatorFacet = facets.find(({ key }) => key === OPERATOR_KEY) ?? null
  const pickupPointFacet =
    facets.find(({ key }) => key === PICKUP_POINT_KEY) ?? null

  if (fuzzyFacet && isFuzzyFacet(fuzzyFacet)) {
    params.append(FUZZY_KEY, fuzzyFacet.value)
  }

  if (operatorFacet && isOperatorFacet(operatorFacet)) {
    params.append(OPERATOR_KEY, operatorFacet.value)
  }

  if (pickupPointFacet) {
    params.append(PICKUP_POINT_KEY, pickupPointFacet.value)
  }
}

interface SearchLikeParams {
  includePagination: boolean
  includeSort: boolean
}

function buildSearchLikeParams(
  args: IntelligentSearchRequestArgs,
  defaults: IntelligentSearchDefaults | undefined,
  segmentData: {
    segmentParams: SegmentParams
    extraFacets: IntelligentSearchFacet[]
  },
  options: SearchLikeParams
): { params: URLSearchParams; path: string } {
  const {
    query = '',
    page,
    count,
    sort,
    selectedFacets = [],
    showInvisibleItems,
    sponsoredCount,
    hideUnavailableItems: searchHideUnavailableItems,
    allowRedirect = false,
  } = args

  const params = new URLSearchParams()

  if (options.includePagination && page !== undefined && count !== undefined) {
    const from = page * count
    const to = count === 0 ? from : from + count - 1

    params.append('from', from.toString())
    params.append('to', to.toString())
  }

  if (query) {
    params.append('query', query)
  }

  if (options.includeSort && sort) {
    params.append('sort', sort)
  }

  const mergedSegmentParams = mergeSegmentParamsWithPickupFromPath(
    segmentData.segmentParams,
    selectedFacets
  )

  appendSegmentParams(params, mergedSegmentParams ?? segmentData.segmentParams)
  addSearchParamsFacets(selectedFacets, params)

  if (showInvisibleItems) {
    params.append('show-invisible-items', 'true')
  }

  if (defaults?.hideUnavailableItems !== undefined) {
    const inStockFacet = selectedFacets.find(({ key }) => key === IN_STOCK_KEY)
    const shouldHideUnavailableItems = inStockFacet
      ? inStockFacet.value
      : (searchHideUnavailableItems?.toString() ??
        defaults.hideUnavailableItems.toString())

    params.append('hideUnavailableItems', shouldHideUnavailableItems)
  }

  if (defaults?.simulationBehavior !== undefined) {
    params.append('simulationBehavior', defaults.simulationBehavior.toString())
  }

  if (defaults?.showSponsored !== undefined) {
    params.append('showSponsored', defaults.showSponsored.toString())
  }

  if (sponsoredCount !== undefined) {
    params.append('sponsoredCount', sponsoredCount.toString())
  }

  if (allowRedirect !== undefined) {
    params.append('allowRedirect', allowRedirect.toString())
  }

  const path = buildAttributePath(
    preparePathFacets(selectedFacets, segmentData.extraFacets)
  )

  return { params, path }
}

function buildProductsParams(
  args: IntelligentSearchRequestArgs,
  segmentParams: SegmentParams
): URLSearchParams {
  const { field, value, hideUnavailableItems, showInvisibleItems } = args

  const params = new URLSearchParams({
    field: field ?? '',
    value: value ?? '',
  })

  appendSegmentParams(params, segmentParams)

  if (hideUnavailableItems) {
    params.append('hideUnavailableItems', 'true')
  }

  if (showInvisibleItems) {
    params.append('show-invisible-items', 'true')
  }

  return params
}

function createRequest(
  path: string,
  params: URLSearchParams
): IntelligentSearchRequest {
  return {
    path,
    params,
    toString() {
      const qs = params.toString()

      if (!path) {
        return qs ? `?${qs}` : ''
      }

      return qs ? `${path}?${qs}` : path
    },
  }
}

/**
 * Pure builder for intelligent-search v1 path + query params.
 * Callers assemble the full URL: `/api/intelligent-search/v1/${endpoint}/${request.path}?${request.params}`.
 */
export function buildIntelligentSearchRequest(
  input: IntelligentSearchRequestInput
): IntelligentSearchRequest {
  const { endpoint, segment, defaults, args = {} } = input
  const segmentData = resolveSegmentData(segment, defaults)

  switch (endpoint) {
    case 'product-search':
    case 'facets': {
      const { params, path } = buildSearchLikeParams(
        args,
        defaults,
        segmentData,
        { includePagination: true, includeSort: true }
      )

      return createRequest(path, params)
    }

    case 'catalog-count': {
      const { params, path } = buildSearchLikeParams(
        args,
        defaults,
        segmentData,
        { includePagination: false, includeSort: false }
      )

      return createRequest(path, params)
    }

    case 'products': {
      const params = buildProductsParams(args, segmentData.segmentParams)

      return createRequest('', params)
    }

    case 'search-suggestions': {
      const params = new URLSearchParams({
        query: args.query?.toString() ?? '',
        locale: defaults?.locale ?? segmentData.segmentParams.locale ?? '',
      })

      return createRequest('', params)
    }

    case 'top-searches': {
      const params = new URLSearchParams({
        locale: defaults?.locale ?? segmentData.segmentParams.locale ?? '',
      })

      return createRequest('', params)
    }

    default: {
      const _exhaustive: never = endpoint

      throw new Error(`Unknown intelligent-search endpoint: ${_exhaustive}`)
    }
  }
}
