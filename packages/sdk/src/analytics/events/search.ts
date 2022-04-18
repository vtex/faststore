// This isn't an ecommerce exclusive event, but it makes sense to include it in stores

import type { LocatorParam } from './common'

export interface SearchParams {
  /** @description search term used on the search result */
  search_term: string
  /** @description number of products filtered on the search result */
  records_filtered: number
}

export interface SearchEvent {
  name: 'search'
  params: SearchParams & LocatorParam
}
