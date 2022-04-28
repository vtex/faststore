import type { IStoreSelectedFacet } from '../../../../__generated__/schema'
import type { Context, Options } from '../../index'
import type { SelectedFacet } from '../../utils/facets'
import { fetchAPI } from '../fetch'
import type { FacetSearchResult } from './types/FacetSearchResult'
import type {
  ProductSearchResult,
  SuggestedTerms,
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
  type: 'product_search' | 'facets'
  sort?: Sort
  selectedFacets?: SelectedFacet[]
  fuzzy?: '0' | '1'
  hideUnavailableItems?: boolean
}

export interface ProductLocator {
  field: 'id' | 'slug'
  value: string
}

export const IntelligentSearch = (
  { account, environment, hideUnavailableItems }: Options,
  ctx: Context
) => {
  const base = `https://${account}.${environment}.com.br/api/io`
  const policyFacet: IStoreSelectedFacet = {
    key: 'trade-policy',
    value: ctx.storage.channel.salesChannel,
  }

  const addDefaultFacets = (facets: SelectedFacet[]) => {
    const facet = facets.find(({ key }) => key === policyFacet.key)

    if (facet === undefined) {
      return [...facets, policyFacet]
    }

    return facets
  }

  const search = <T>({
    query = '',
    page,
    count,
    sort = '',
    selectedFacets = [],
    type,
    fuzzy = '0',
  }: SearchArgs): Promise<T> => {
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      count: count.toString(),
      query,
      sort,
      fuzzy,
    })

    if (hideUnavailableItems !== undefined) {
      params.append('hideUnavailableItems', hideUnavailableItems.toString())
    }

    const pathname = addDefaultFacets(selectedFacets)
      .map(({ key, value }) => `${key}/${value}`)
      .join('/')

    return fetchAPI(
      `${base}/_v/api/intelligent-search/${type}/${pathname}?${params.toString()}`
    )
  }

  const products = (args: Omit<SearchArgs, 'type'>) =>
    search<ProductSearchResult>({ ...args, type: 'product_search' })

  const suggestedProducts = (
    args: Omit<SearchArgs, 'type'>
  ): Promise<ProductSearchResult> =>
    fetchAPI(`${base}/api/suggestion_products/?term=${args.query}`)

  const suggestedTerms = (
    args: Omit<SearchArgs, 'type'>
  ): Promise<SuggestedTerms> =>
    fetchAPI(`${base}/api/split/suggestion_search/?q=${args.query}`)

  const facets = (args: Omit<SearchArgs, 'type'>) =>
    search<FacetSearchResult>({ ...args, type: 'facets' })

  return {
    facets,
    products,
    suggestedTerms,
    suggestedProducts,
  }
}
