import type { SearchSort, Facet } from '../../types'

/**
 * @deprecated Old state value. \
 * prefer the usage of the one present at sdk/src/types
 */
export interface State {
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
  /**
   * @description params from other sources to preserve when building URLs
   */
  passThrough: URLSearchParams
}
