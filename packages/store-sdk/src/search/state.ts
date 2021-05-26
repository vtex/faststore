export type SearchSort =
  | 'price-desc'
  | 'price-asc'
  | 'orders-desc'
  | 'name-desc'
  | 'name-asc'
  | 'release-desc'
  | 'discount-desc'
  | 'score-desc'

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
  personalized: boolean
}

export const initialize = ({
  sort = 'score-desc',
  selectedFacets = [],
  personalized = false,
  term = null,
  base = '/',
}: Partial<SearchParamsState> | undefined = {}) => ({
  sort,
  selectedFacets,
  personalized,
  term,
  base: base.endsWith('/') ? base : `${base}/`,
})
