export type SearchSort =
  | 'price_desc'
  | 'price_asc'
  | 'orders_desc'
  | 'name_desc'
  | 'name_asc'
  | 'release_desc'
  | 'discount_desc'
  | 'score_desc'

export interface Facet {
  key: string
  value: string
}

export interface SearchParamsState {
  /** @description search sorting criteria */
  sort: SearchSort
  /**
   * @description selected facets
   * */
  selectedFacets: Facet[]
  /** @description full text term */
  term: string | null
  /**
   * @description the base path url for the search context
   * */
  base: string
  /**
   * @description current pagination cursor
   */
  page: number
}

export const initialize = ({
  sort = 'score_desc',
  selectedFacets = [],
  term = null,
  base = '/',
  page = 0,
}: Partial<SearchParamsState> | undefined = {}) => ({
  sort,
  selectedFacets,
  term,
  base: base.endsWith('/') ? base : `${base}/`,
  page,
})
