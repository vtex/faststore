export interface AttributeSearchResult {
  total: number
  pagination: Pagination
  sampling: boolean
  translated: boolean
  locale: string
  query: string
  operator: string
  fuzzy: string
  attributes: Attribute[]
}

export interface Attribute {
  ids: string[]
  visible: boolean
  values: Value[]
  active: boolean
  key: string
  originalKey: string
  label: string
  originalLabel: string
  type: string
  minValue?: number
  maxValue?: number
  templateURL?: string
  proxyURL?: string
}

export interface Value {
  count: number
  active: boolean
  key?: string
  label?: string
  id?: string
  originalKey?: string
  originalLabel?: string
  proxyURL: string
  from?: string
  to?: string
}

export interface Pagination {
  count: number
  current: Current
  before: any[]
  after: any[]
  perPage: number
  next: First
  previous: First
  first: First
  last: First
}

export interface Current {
  index: number
  proxyURL: string
}

export interface First {
  index: number
}
