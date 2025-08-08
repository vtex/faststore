import type { Context, Options } from '../../'
import type { IStoreSelectedFacet } from '../../../../__generated__/schema'
import { getWithCookie } from '../../utils/cookies'
import type {
  FuzzyFacet,
  OperatorFacet,
  SelectedFacet,
} from '../../utils/facets'
import { fetchAPI } from '../fetch'
import type {
  Facet,
  FacetSearchResult,
  FacetValueBoolean,
} from './types/FacetSearchResult'
import type { ProductCountResult } from './types/ProductCountResult'
import type {
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

const POLICY_KEY = 'trade-policy'
const REGION_KEY = 'region-id'
const FUZZY_KEY = 'fuzzy'
const OPERATOR_KEY = 'operator'
const PICKUP_POINT_KEY = 'pickupPoint'
const SHIPPING_KEY = 'shipping'
const DELIVERY_OPTIONS_KEY = 'delivery-options'

const EXTRA_FACETS_KEYS = new Set([
  POLICY_KEY,
  REGION_KEY,
  FUZZY_KEY,
  OPERATOR_KEY,
  PICKUP_POINT_KEY,
  SHIPPING_KEY,
  DELIVERY_OPTIONS_KEY,
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
  const base = `https://${account}.${environment}.com.br/api/io`
  const withCookie = getWithCookie(ctx)

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

  const getPolicyFacet = (): IStoreSelectedFacet | null => {
    const { salesChannel } = ctx.storage.channel

    if (!salesChannel) {
      return null
    }

    return {
      key: POLICY_KEY,
      value: salesChannel,
    }
  }

  const getRegionFacet = (): IStoreSelectedFacet | null => {
    const { regionId, seller } = ctx.storage.channel
    const sellerRegionId = seller
      ? Buffer.from(`SW#${seller}`).toString('base64')
      : null
    const facet = sellerRegionId ?? regionId

    if (!facet) {
      return null
    }

    return {
      key: REGION_KEY,
      value: facet,
    }
  }

  const addDefaultFacets = (facets: SelectedFacet[]) => {
    const withDefaultFacets = facets.filter(
      ({ key }) => !EXTRA_FACETS_KEYS.has(key)
    )

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

    const policyFacet =
      facets.find(({ key }) => key === POLICY_KEY) ?? getPolicyFacet()

    const regionFacet =
      facets.find(({ key }) => key === REGION_KEY) ?? getRegionFacet()

    if (shippingFacet !== null) {
      withDefaultFacets.push(shippingFacet)
    }

    if (deliveryOptionsFacet !== null) {
      withDefaultFacets.push(deliveryOptionsFacet)
    }

    if (policyFacet !== null) {
      withDefaultFacets.push(policyFacet)
    }

    if (regionFacet !== null) {
      withDefaultFacets.push(regionFacet)
    }

    return withDefaultFacets
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

  const search = <T>({
    query = '',
    page,
    count,
    sort = '',
    selectedFacets = [],
    type,
    showInvisibleItems,
    sponsoredCount,
    hideUnavailableItems: searchHideUnavailableItems,
    allowRedirect = false,
  }: SearchArgs): Promise<T> => {
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      count: count !== 0 ? count.toString() : '1',
      query,
      sort,
      locale: ctx.storage.locale,
    })

    addSearchParamsFacets(selectedFacets, params)

    if (showInvisibleItems) {
      params.append('show-invisible-items', 'true')
    }

    if (hideUnavailableItems !== undefined) {
      params.append(
        'hideUnavailableItems',
        searchHideUnavailableItems?.toString() ??
          hideUnavailableItems.toString()
      )
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

    const pathname = addDefaultFacets(selectedFacets)
      .map(({ key, value }) => `${key}/${value}`)
      .join('/')

    return fetchAPI(
      `${base}/_v/api/intelligent-search/${type}/${pathname}?${params.toString()}`,
      { headers }
    )
  }

  const products = (args: Omit<SearchArgs, 'type'>) =>
    search<ProductSearchResult>({ ...args, type: 'product_search' })

  const suggestedTerms = (
    args: Omit<SearchArgs, 'type'>
  ): Promise<Suggestion> => {
    const params = new URLSearchParams({
      query: args.query?.toString() ?? '',
      locale: ctx.storage.locale,
    })

    return fetchAPI(
      `${base}/_v/api/intelligent-search/search_suggestions?${params.toString()}`,
      { headers }
    )
  }

  const topSearches = (): Promise<Suggestion> => {
    const params = new URLSearchParams({
      locale: ctx.storage.locale,
    })

    return fetchAPI(
      `${base}/_v/api/intelligent-search/top_searches?${params.toString()}`,
      { headers }
    )
  }

  const facets = (args: Omit<SearchArgs, 'type'>) =>
    search<FacetSearchResult>({ ...args, type: 'facets' })

  const productCount = (
    args: Pick<SearchArgs, 'query'>
  ): Promise<ProductCountResult> => {
    const params = new URLSearchParams()

    if (args?.query) {
      params.append('query', args.query.toString())
    }

    return fetchAPI(
      `${base}/_v/api/intelligent-search/catalog_count?${params.toString()}`,
      { headers }
    )
  }

  return {
    facets,
    products,
    suggestedTerms,
    topSearches,
    productCount,
  }
}
