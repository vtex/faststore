declare type Maybe<T> = T | undefined | null
declare type ArrayItem<A> = A extends ReadonlyArray<infer T> ? T : never

// Missing types from graphql plugin
declare type Vtex_FilterType = 'BRAND' | 'CATEGORYTREE' | 'TEXT' | 'PRICERANGE'

declare type Vtex_SelectedFacetInput = {
  key: string
  value: string
}

declare type Vtex_SimulationBehavior = 'default' | 'skip'

declare type Vtex_ItemInput = any

declare type Vtex_MarketingDataInput = any

declare type Vtex_UserType = any

declare type Vtex_AddressType = any

declare type Vtex_ShippingItem = {
  id: string
  quantity: string
  seller: string
}
