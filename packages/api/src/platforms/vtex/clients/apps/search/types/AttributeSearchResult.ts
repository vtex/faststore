type FilterType = 'PRICERANGE' | 'TEXT' | 'NUMBER' | 'CATEGORYTREE'
export interface FacetSearchResult {
  facets: Facet[]
  breadcrumb: Breadcrumb
}

export interface Facet {
  type: FilterType
  name: string
  hidden: boolean
  values: FacetValue[]
  quantity?: number
}

interface FacetValue {
  quantity: number
  name: string
  key: string
  value: string
  selected?: boolean
  range?: {
    from: number
    to: number
  }
  children?: FacetValue[]
  id?: string
}

interface Breadcrumb {
  href: string
  name: string
}
