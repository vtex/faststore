import type { Context, Options } from '../../'
import { getWithCookie } from '../../utils/cookies'
import type {
  FuzzyFacet,
  OperatorFacet,
  SelectedFacet,
} from '../../utils/facets'
import {
  appendSegmentParams,
  buildSegmentParams,
  getSegmentLocale,
} from '../../utils/segment'
import {
  buildAttributePath,
  concatSelectedFacets,
  mergeSegmentParamsWithPickupFromPath,
} from '../../utils/searchPath'
import { fetchAPI } from '../fetch'
import type {
  Facet,
  FacetSearchResult,
  FacetValueBoolean,
} from './types/FacetSearchResult'
import type { ProductCountResult } from './types/ProductCountResult'
import type {
  Product,
  ProductSearchResult,
  Suggestion,
} from './types/ProductSearchResult'

export type Sort =
  | 'price:desc'
  | 'price:asc'
  | 'orders:desc'
  | 'name:desc'
  | 'name:asc'
  | 'release:desc'
  | 'discount:desc'
  | ''

export interface SearchArgs {
  query?: string
  page: number
  count: number
  type: 'product_search' | 'facets' | 'sponsored_products'
  sort?: Sort
  selectedFacets?: SelectedFacet[]
  fuzzy?: '0' | '1' | 'auto'
  hideUnavailableItems?: boolean
  showInvisibleItems?: boolean
  showSponsored?: boolean
  sponsoredCount?: number
  allowRedirect?: boolean
}

export interface ProductLocator {
  field: 'id' | 'slug'
  value: string
}

export type ProductIdentifierField = 'id' | 'slug' | 'ean' | 'reference' | 'sku'

export interface FetchProductArgs {
  field: ProductIdentifierField
  value: string
  showInvisibleItems?: boolean
  hideUnavailableItems?: boolean
}

export interface ProductsByIdentifierArgs {
  field: ProductIdentifierField
  values: string[]
  showInvisibleItems?: boolean
  hideUnavailableItems?: boolean
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

export const isFacetBoolean = (
  facet: Facet
): facet is Facet<FacetValueBoolean> => facet.type === 'TEXT'

const isFuzzyFacet = (facet: SelectedFacet): facet is FuzzyFacet => {
  return (
    facet.key === 'fuzzy' &&
    (facet.value === '0' || facet.value === '1' || facet.value === 'auto')
  )
}

const isOperatorFacet = (facet: SelectedFacet): facet is OperatorFacet => {
  return (
    facet.key === 'operator' && (facet.value === 'and' || facet.value === 'or')
  )
}

export const IntelligentSearch = (
  {
    account,
    environment,
    hideUnavailableItems,
    simulationBehavior,
    showSponsored,
    subDomainPrefix,
  }: Options,
  ctx: Context
) => {
  const base = `https://${account}.${environment}.com.br`
  const withCookie = getWithCookie(ctx)
  const segmentData = buildSegmentParams(ctx)

  const host =
    new Headers(ctx.headers).get('x-forwarded-host') ?? ctx.headers?.host ?? ''

  const selectedPrefix = subDomainPrefix
    ? subDomainPrefix
        .map((prefix) => prefix + '.')
        .find((prefix) => host.includes(prefix)) || ''
    : ''

  const forwardedHost = host.replace(selectedPrefix, '')

  const headers: HeadersInit = withCookie({
    'content-type': 'application/json',
    'X-FORWARDED-HOST': forwardedHost,
  })

  const preparePathFacets = (facets: SelectedFacet[]) => {
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

    if (shippingFacet !== null) {
      withShippingFacets.push(shippingFacet)
    }

    if (deliveryOptionsFacet !== null) {
      withShippingFacets.push(deliveryOptionsFacet)
    }

    return concatSelectedFacets(withShippingFacets, segmentData.extraFacets)
  }

  const addSearchParamsFacets = (
    facets: SelectedFacet[],
    params: URLSearchParams
  ) => {
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

  const buildSearchParams = ({
    query = '',
    page,
    count,
    sort,
    selectedFacets = [],
    showInvisibleItems,
    sponsoredCount,
    hideUnavailableItems: searchHideUnavailableItems,
    allowRedirect = false,
  }: Partial<Omit<SearchArgs, 'type'>>) => {
    const params = new URLSearchParams()

    if (page !== undefined && count !== undefined) {
      const from = page * count
      const to = count !== 0 ? from + count - 1 : from

      params.append('from', from.toString())
      params.append('to', to.toString())
    }

    if (query) {
      params.append('query', query)
    }

    if (sort) {
      params.append('sort', sort)
    }

    const mergedSegmentParams = mergeSegmentParamsWithPickupFromPath(
      segmentData.segmentParams,
      selectedFacets
    )

    appendSegmentParams(
      params,
      mergedSegmentParams ?? segmentData.segmentParams
    )
    addSearchParamsFacets(selectedFacets, params)

    if (showInvisibleItems) {
      params.append('show-invisible-items', 'true')
    }

    if (hideUnavailableItems !== undefined) {
      const inStockFacet = selectedFacets.find(
        ({ key }) => key === IN_STOCK_KEY
      )
      const shouldHideUnavailableItems = inStockFacet
        ? inStockFacet.value
        : (searchHideUnavailableItems?.toString() ??
          hideUnavailableItems.toString())

      params.append('hideUnavailableItems', shouldHideUnavailableItems)
    }

    if (simulationBehavior !== undefined) {
      params.append('simulationBehavior', simulationBehavior.toString())
    }

    if (showSponsored !== undefined) {
      params.append('showSponsored', showSponsored.toString())
    }

    if (sponsoredCount !== undefined) {
      params.append('sponsoredCount', sponsoredCount.toString())
    }

    if (allowRedirect !== undefined) {
      params.append('allowRedirect', allowRedirect.toString())
    }

    const pathname = buildAttributePath(preparePathFacets(selectedFacets))

    return { params, pathname }
  }

  const search = <T>({ type, ...args }: SearchArgs): Promise<T> => {
    const { params, pathname } = buildSearchParams(args)
    const endpoint = type === 'facets' ? 'facets' : 'product-search'

    return fetchAPI(
      `${base}/api/intelligent-search/v1/${endpoint}/${pathname}?${params.toString()}`,
      { headers }
    )
  }

  const products = (args: Omit<SearchArgs, 'type'>) =>
    search<ProductSearchResult>({ ...args, type: 'product_search' })

  const fetchProduct = ({
    field,
    value,
    hideUnavailableItems,
    showInvisibleItems,
  }: FetchProductArgs): Promise<Product | null> => {
    const { segmentParams } = segmentData
    const params = new URLSearchParams({
      field,
      value,
    })

    appendSegmentParams(params, segmentParams)

    if (hideUnavailableItems) {
      params.append('hideUnavailableItems', 'true')
    }

    if (showInvisibleItems) {
      params.append('show-invisible-items', 'true')
    }

    return Promise.resolve(
      fetchAPI(
        `${base}/api/intelligent-search/v1/products?${params.toString()}`,
        { headers }
      )
    ).catch(() => null)
  }

  const productsByIdentifier = async ({
    field,
    values,
    showInvisibleItems,
    hideUnavailableItems,
  }: ProductsByIdentifierArgs): Promise<Product[]> => {
    const productsResult = await Promise.all(
      values.map((value) =>
        fetchProduct({ field, value, hideUnavailableItems, showInvisibleItems })
      )
    )

    return productsResult.filter(
      (product): product is Product => product !== null
    )
  }

  const suggestedTerms = (
    args: Omit<SearchArgs, 'type'>
  ): Promise<Suggestion> => {
    const params = new URLSearchParams({
      query: args.query?.toString() ?? '',
      locale: getSegmentLocale(ctx),
    })

    return fetchAPI(
      `${base}/api/intelligent-search/v1/search-suggestions?${params.toString()}`,
      { headers }
    )
  }

  const topSearches = (): Promise<Suggestion> => {
    const params = new URLSearchParams({
      locale: getSegmentLocale(ctx),
    })

    return fetchAPI(
      `${base}/api/intelligent-search/v1/top-searches?${params.toString()}`,
      { headers }
    )
  }

  const facets = (args: Omit<SearchArgs, 'type'>) =>
    search<FacetSearchResult>({ ...args, type: 'facets' })

  const productCount = (
    args: Omit<SearchArgs, 'type' | 'page' | 'count' | 'sort'>
  ): Promise<ProductCountResult> => {
    const { params, pathname } = buildSearchParams(args)

    return fetchAPI(
      `${base}/api/intelligent-search/v1/catalog-count/${pathname}?${params.toString()}`,
      { headers }
    )
  }

  return {
    facets,
    products,
    fetchProduct,
    productsByIdentifier,
    suggestedTerms,
    topSearches,
    productCount,
  }
}
