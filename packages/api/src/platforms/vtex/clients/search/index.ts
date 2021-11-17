import type { Context, Options } from '../../index'
import { fetchAPI } from '../fetch'
import type { SelectedFacet } from '../../utils/facets'
import type { ProductSearchResult } from './types/ProductSearchResult'
import type { AttributeSearchResult } from './types/AttributeSearchResult'

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
  type: 'product_search' | 'attribute_search'
  sort?: Sort
  selectedFacets?: SelectedFacet[]
  fuzzy?: '0' | '1'
}

export interface ProductLocator {
  field: 'id' | 'slug'
  value: string
}

export const IntelligentSearch = (
  { account, environment }: Options,
  ctx: Context
) => {
  const base = `http://portal.${environment}.com.br/search-api/v1/${account}`
  const policyFacet = { key: 'trade-policy', value: ctx.storage.channel }

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

    const pathname = addDefaultFacets(selectedFacets)
      .map(({ key, value }) => `${key}/${value}`)
      .join('/')

    return fetchAPI(
      `${base}/api/split/${type}/${pathname}?${params.toString()}`
    )
  }

  const products = (args: Omit<SearchArgs, 'type'>) =>
    search<ProductSearchResult>({ ...args, type: 'product_search' })

  const facets = (args: Omit<SearchArgs, 'type'>) =>
    search<AttributeSearchResult>({ ...args, type: 'attribute_search' })

  return {
    facets,
    products,
  }
}
