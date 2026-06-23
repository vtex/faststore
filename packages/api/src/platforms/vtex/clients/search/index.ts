import pLimit from 'p-limit'

import type { GraphqlContext } from '../../'
import { getWithCookie } from '../../utils/cookies'
import type { SelectedFacet } from '../../utils/facets'
import {
  buildIntelligentSearchRequest,
  parseSegmentCookie,
  type ProductIdentifierField,
  type Sort,
} from '../../utils/intelligentSearchRequest'
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

export type {
  ProductIdentifierField,
  Sort,
} from '../../utils/intelligentSearchRequest'

// Bounds simultaneous IS v1 /products calls; values cardinality is capped
// upstream by DataLoader maxBatchSize (99) and cross-sell/products `first`.
const PRODUCTS_BY_IDENTIFIER_CONCURRENCY = 10

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

export const isFacetBoolean = (
  facet: Facet
): facet is Facet<FacetValueBoolean> => facet.type === 'TEXT'

function getRegionIdFromContext(ctx: GraphqlContext): string | undefined {
  const { regionId, seller } = ctx.storage.channel
  const sellerRegionId = seller
    ? Buffer.from(`SW#${seller}`).toString('base64')
    : undefined

  return sellerRegionId ?? (regionId || undefined)
}

function getSegmentLocale(ctx: GraphqlContext): string {
  const segment = parseSegmentCookie(ctx.headers?.cookie)

  return (segment.cultureInfo as string | undefined) ?? ctx.storage.locale
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
  ctx: GraphqlContext
) => {
  const base = `https://${account}.${environment}.com.br`
  const withCookie = getWithCookie(ctx)
  const segment = parseSegmentCookie(ctx.headers?.cookie)

  const requestDefaults = () => ({
    salesChannel: ctx.storage.channel.salesChannel,
    regionId: getRegionIdFromContext(ctx),
    locale: getSegmentLocale(ctx),
    hideUnavailableItems,
    simulationBehavior,
    showSponsored,
  })

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

  const search = <T>({ type, ...args }: SearchArgs): Promise<T> => {
    const endpoint = type === 'facets' ? 'facets' : 'product-search'
    const request = buildIntelligentSearchRequest({
      endpoint,
      segment,
      defaults: requestDefaults(),
      args,
    })

    return fetchAPI(
      `${base}/api/intelligent-search/v1/${endpoint}/${request.path}?${request.params.toString()}`,
      { headers }
    )
  }

  const products = (args: Omit<SearchArgs, 'type'>) =>
    search<ProductSearchResult>({ ...args, type: 'product_search' })

  const fetchProduct = ({
    field,
    value,
    hideUnavailableItems: hideUnavailable,
    showInvisibleItems,
  }: FetchProductArgs): Promise<Product> => {
    const request = buildIntelligentSearchRequest({
      endpoint: 'products',
      segment,
      defaults: requestDefaults(),
      args: {
        field,
        value,
        hideUnavailableItems: hideUnavailable,
        showInvisibleItems,
      },
    })

    return fetchAPI(
      `${base}/api/intelligent-search/v1/products?${request.params.toString()}`,
      { headers }
    )
  }

  const productsByIdentifier = async ({
    field,
    values,
    showInvisibleItems,
    hideUnavailableItems: hideUnavailable,
  }: ProductsByIdentifierArgs): Promise<Product[]> => {
    const limit = pLimit(PRODUCTS_BY_IDENTIFIER_CONCURRENCY)

    const productsResult = await Promise.all(
      values.map((value) =>
        limit(async () => {
          try {
            return await fetchProduct({
              field,
              value,
              hideUnavailableItems: hideUnavailable,
              showInvisibleItems,
            })
          } catch {
            return null
          }
        })
      )
    )

    return productsResult.filter(
      (product): product is Product => product !== null
    )
  }

  const suggestedTerms = (
    args: Omit<SearchArgs, 'type'>
  ): Promise<Suggestion> => {
    const request = buildIntelligentSearchRequest({
      endpoint: 'search-suggestions',
      segment,
      defaults: requestDefaults(),
      args: { query: args.query },
    })

    return fetchAPI(
      `${base}/api/intelligent-search/v1/search-suggestions?${request.params.toString()}`,
      { headers }
    )
  }

  const topSearches = (): Promise<Suggestion> => {
    const request = buildIntelligentSearchRequest({
      endpoint: 'top-searches',
      segment,
      defaults: requestDefaults(),
    })

    return fetchAPI(
      `${base}/api/intelligent-search/v1/top-searches?${request.params.toString()}`,
      { headers }
    )
  }

  const facets = (args: Omit<SearchArgs, 'type'>) =>
    search<FacetSearchResult>({ ...args, type: 'facets' })

  const productCount = (
    args: Omit<SearchArgs, 'type' | 'page' | 'count' | 'sort'>
  ): Promise<ProductCountResult> => {
    const request = buildIntelligentSearchRequest({
      endpoint: 'catalog-count',
      segment,
      defaults: requestDefaults(),
      args,
    })

    return fetchAPI(
      `${base}/api/intelligent-search/v1/catalog-count/${request.path}?${request.params.toString()}`,
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
