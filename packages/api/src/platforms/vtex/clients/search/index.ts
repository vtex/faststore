import { fetchAPI } from '../fetch'
import type { IStoreSelectedFacet } from '../../../../__generated__/schema'
import type { Context, Options } from '../../'
import type { SelectedFacet } from '../../utils/facets'
import type {
  Facet,
  FacetValueBoolean,
  FacetSearchResult,
} from './types/FacetSearchResult'
import type {
  ProductSearchResult,
  Suggestion,
} from './types/ProductSearchResult'
import { getStoreCookie } from '../../utils/cookies'

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
  type: 'product_search' | 'facets'
  sort?: Sort
  selectedFacets?: SelectedFacet[]
  fuzzy?: '0' | '1' | 'auto' | undefined
  hideUnavailableItems?: boolean
}

export interface ProductLocator {
  field: 'id' | 'slug'
  value: string
}

// channel keys
const POLICY_KEY = 'trade-policy'
const REGION_KEY = 'region-id'

// search parameters
const FUZZY_KEY = 'fuzzy'
const OPERATOR_KEY = 'operator'

const EXTRA_FACETS_KEYS = new Set([
  POLICY_KEY,
  REGION_KEY,
  FUZZY_KEY,
  OPERATOR_KEY,
])

export const isFacetBoolean = (
  facet: Facet
): facet is Facet<FacetValueBoolean> => facet.type === 'TEXT'

export const IntelligentSearch = (
  { account, environment, hideUnavailableItems }: Options,
  ctx: Context
) => {
  const base = `https://${account}.${environment}.com.br/api/io`
  const storeCookies = getStoreCookie(ctx)

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

    const policyFacet =
      facets.find(({ key }) => key === POLICY_KEY) ?? getPolicyFacet()

    const regionFacet =
      facets.find(({ key }) => key === REGION_KEY) ?? getRegionFacet()

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

    if (fuzzyFacet !== null) {
      params.append(FUZZY_KEY, fuzzyFacet?.value)
    }

    if (operatorFacet !== null) {
      params.append(OPERATOR_KEY, operatorFacet?.value)
    }
  }

  const search = <T>({
    query = '',
    page,
    count,
    sort = '',
    selectedFacets = [],
    type,
  }: SearchArgs): Promise<T> => {
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      count: count.toString(),
      query,
      sort,
      locale: ctx.storage.locale,
    })

    if (hideUnavailableItems !== undefined) {
      params.append('hideUnavailableItems', hideUnavailableItems.toString())
    }

    const pathname = addDefaultFacets(selectedFacets)
      .map(({ key, value }) => `${key}/${value}`)
      .join('/')

    addSearchParamsFacets(selectedFacets, params)

    return fetchAPI(
      `${base}/_v/api/intelligent-search/${type}/${pathname}?${params.toString()}`,
      undefined,
      { storeCookies }
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
      undefined,
      { storeCookies }
    )
  }

  const topSearches = (): Promise<Suggestion> => {
    const params = new URLSearchParams({
      locale: ctx.storage.locale,
    })

    return fetchAPI(
      `${base}/_v/api/intelligent-search/top_searches?${params.toString()}`,
      undefined,
      { storeCookies }
    )
  }

  const facets = (args: Omit<SearchArgs, 'type'>) =>
    search<FacetSearchResult>({ ...args, type: 'facets' })

  return {
    facets,
    products,
    suggestedTerms,
    topSearches,
  }
}
