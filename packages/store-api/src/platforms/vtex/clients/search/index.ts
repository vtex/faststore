import { fetchAPI } from '../common'
import type { Options } from '../..'
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

export interface SelectedFacet {
  key: string
  value: string
}

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

export const IntelligentSearch = (options: Options) => {
  const { channel } = options
  const base = `http://search.biggylabs.com.br/search-api/v1/${options.account}`

  // TODO: change here once supporting sales channel
  const defaultFacets = [
    {
      key: 'trade-policy',
      value: channel,
    },
  ]

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

    const pathname = [...defaultFacets, ...selectedFacets]
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
