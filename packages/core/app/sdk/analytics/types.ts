import type { Item } from '@faststore/sdk'

type AdditionalItemProperties = {
  product_reference_id: string | null
  item_variant_name: string | null
}

export type AnalyticsItem = Item & AdditionalItemProperties

export interface SearchSelectItemParams {
  url: string
  items: Array<{
    item_id?: string
    item_variant?: string
    index: number
  }>
}

export interface SearchSelectItemEvent {
  name: 'search_select_item'
  params: SearchSelectItemParams
}

export interface IntelligentSearchQueryParams {
  url: string
  locale: string
  term: string
  logicalOperator: string
  isTermMisspelled: boolean
  totalCount: number
}

export interface IntelligentSearchQueryEvent {
  name: 'intelligent_search_query'
  params: IntelligentSearchQueryParams
}
