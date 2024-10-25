import type { Context, Options } from '../../'
import type { IStoreSelectedFacet } from '../../../../__generated__/schema'
import { getStoreCookie } from '../../utils/cookies'
import type { SelectedFacet } from '../../utils/facets'
import { fetchAPI } from '../fetch'
import type {
  Facet,
  FacetSearchResult,
  FacetValueBoolean,
} from './types/FacetSearchResult'
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
}

export interface ProductLocator {
  field: 'id' | 'slug'
  value: string
}

const POLICY_KEY = 'trade-policy'
const REGION_KEY = 'region-id'
const CHANNEL_KEYS = new Set([POLICY_KEY, REGION_KEY])

export const isFacetBoolean = (
  facet: Facet
): facet is Facet<FacetValueBoolean> => facet.type === 'TEXT'

export const IntelligentSearch = (
  { account, environment, hideUnavailableItems, simulationBehavior, showSponsored }: Options,
  ctx: Context
) => {
  const base = `https://${account}.${environment}.com.br/api/io`
  const storeCookies = getStoreCookie(ctx)

  const getVtexSegment = (cookies?: string) => {
    if (typeof cookies !== 'string') {
      return null;
    }

    const match = cookies.match(/vtex_segment=([^;]*)/);
    return match ? match[1] : null;
  };

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
    const withDefaultFacets = facets.filter(({ key }) => !CHANNEL_KEYS.has(key))

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

  const search = <T>({
    query = '',
    page,
    count,
    sort = '',
    selectedFacets = [],
    type,
    fuzzy = 'auto',
    showInvisibleItems,
  }: SearchArgs): Promise<T> => {
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      count: count.toString(),
      query,
      sort,
      fuzzy,
      locale: ctx.storage.locale,
    })

    if (showInvisibleItems) {
      params.append('show-invisible-items', 'true')
    }

    if (hideUnavailableItems !== undefined) {
      params.append('hideUnavailableItems', hideUnavailableItems.toString())
    }

    if (simulationBehavior !== undefined) {
      params.append('simulationBehavior', simulationBehavior.toString())
    }

    if (showSponsored !== undefined) {
      params.append('showSponsored', showSponsored.toString())
    }

    const pathname = addDefaultFacets(selectedFacets)
      .map(({ key, value }) => `${key}/${value}`)
      .join('/')

    const segmentCookie = ctx ? getVtexSegment(ctx.headers.cookie) : null

    console.log("search", segmentCookie)

    return fetchAPI(
      `${base}/_v/api/intelligent-search/${type}/${pathname}?${params.toString()}`,
      undefined,
      { storeCookies, segmentCookie },
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
