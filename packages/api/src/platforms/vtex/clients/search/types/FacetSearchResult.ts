type FilterType = 'PRICERANGE' | 'TEXT' | 'NUMBER' | 'CATEGORYTREE'
export interface FacetSearchResult {
  facets: Facet[]
  breadcrumb: Breadcrumb
}

export interface Facet<T = FacetValueBoolean | FacetValueRange> {
  type: FilterType
  name: string
  hidden: boolean
  values: T[]
  quantity?: number
  key: string
}

export interface FacetValueBoolean {
  quantity: number
  name: string
  key: string
  value: string
  selected: boolean
}

export interface FacetValueRange {
  range: {
    from: number
    to: number
  }
}

interface Breadcrumb {
  href: string
  name: string
}
