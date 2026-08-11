export type { Root as StoreAggregateOfferRoot } from './aggregateOffer'
export type { Root as StorePropertyValueRoot } from './propertyValue'
export type { Root as StoreCollectionRoot } from './collection'
export type { Root as StoreFacetRoot } from './facet'
export type { Root as StoreSearchResultRoot } from './searchResult'
export type { Root as StoreSeoRoot } from './seo'
export type { Root as StoreShippingSLARoot } from './shippingSLA'
export type { Root as StoreOfferRoot } from './offer'
export type { Root as StoreSkuVariationsRoot } from './skuVariations'
export type { Root as StoreProductGroupRoot } from './productGroup'
export type { Root as StoreProductRoot } from './product'
export type { Root as StoreOrganizationRoot } from './organization'

export type StoreCartRoot = {
  /**
   * The VTEX orderForm used to build the StoreCart response. This is an
   * internal resolver root field and is not exposed by the GraphQL schema.
   * Store API extensions can use it to resolve StoreCart fields.
   */
  __orderForm: import('../clients/commerce/types/OrderForm').OrderForm
}
