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

export interface IntelligentSearchAutocompleteQueryParams {
  url: string
  locale: string
  term: string
  logicalOperator: string
  isTermMisspelled: boolean
  totalCount: number
}

export interface IntelligentSearchAutocompleteQueryEvent {
  name: 'intelligent_search_autocomplete_query'
  params: IntelligentSearchAutocompleteQueryParams
}

export interface IntelligentSearchAutocompleteClickParams {
  term: string
  url?: string
  position?: number
  productId?: string
}

export interface IntelligentSearchAutocompleteClickEvent {
  name: 'intelligent_search_autocomplete_click'
  params: IntelligentSearchAutocompleteClickParams
}

export type SearchEvents =
  | SearchSelectItemEvent
  | IntelligentSearchQueryEvent
  | IntelligentSearchAutocompleteQueryEvent
  | IntelligentSearchAutocompleteClickEvent

/**
 * RC event types
 * Types copied from Request Capture App: https://github.com/vtex/request-capture-app/blob/1becac32c002cb03a57bf36c8a7f9400eab8b933/react/typings/rcevents.d.ts
 */

export interface HomeView {}

export interface CategoryView {
  departmentId?: string
  departmentName?: string
  categoryId?: string
  categoryName?: string
}

export interface DepartmentView {
  departmentId?: string
  departmentName?: string
}

export interface InternalSiteSearchView {
  siteSearchTerm?: string // ex: "areia"
  siteSearchForm?: string // ex: "/gatos/ambiente--gatos/caixa-de-areia/areia?PS=20"
  siteSearchCategory?: string // ex: "10000283"
  siteSearchResults?: number // ex: 26
}

type SkuId = string

export interface ProductView {
  skuStockOutFromProductDetail: string[]
  productId: string
  productReferenceId: string
  productEans: string[]
  skuStocks: Record<SkuId, number>
  productName: string
  productBrandId: string
  productBrandName: string
  productDepartmentId: string
  productDepartmentName: string
  productCategoryId: string
  productCategoryName: string
  productListPrice: number
  productPrice: number
  sellerId: string
  sellerIds: string // ex: "00443713,04412311,1"
}

export interface OtherView {}
