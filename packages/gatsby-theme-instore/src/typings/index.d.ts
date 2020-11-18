declare type Maybe<T> = T | undefined | null
declare type ArrayItem<A> = A extends ReadonlyArray<infer T> ? T : never
declare type Vtex_FilterType = 'BRAND' | 'CATEGORYTREE' | 'TEXT' | 'PRICERANGE'
declare type Vtex_SelectedFacetInput = {
  key: string
  value: string
}
declare type Vtex_SimulationBehavior = 'default' | 'skip'
declare type Optional<T> = T | null | undefined
declare type AnyObject = Record<string, any>
interface Store {
  id: string
  country: string
  name: string
  tradePolicy: string
  address: string
  number: string
  neighborhood: string
  city: string
  state: string
  postalCode: string
  mobileNumber: string | null
  pickupPoint: string
  franchiseAccount: string
}
interface Vendor {
  id: string
  name: string
  username: string
  storeId: string
  code: string | null
  store: Store
  franchiseAccount?: string | null
  pickupPointId?: string | null
}
interface InStoreConfig {
  orderPlacedHook: Record<string, any>
  cancelOrderConfig: Record<string, any>
  showStock: boolean
  showAddressReference: boolean
  defaultSellerId: string
  featureToogle: Record<string, any>
  customerProfile: Record<string, any>
  accountName: string
  splunkConfig: Record<string, any>
  MasterDataConfig: Record<string, any>
  OMSFilters: Record<string, any>
  payments: Record<string, any>
  accounts: Record<string, InStoreConfig>
  vendors: Record<string, InStoreConfig>
  deviceNames: Record<string, any>
  printingConfig: Record<string, any>
  deviceConfig: Record<string, any>
  enableIdentificationTypes: Record<string, any>
  transferEnabled: boolean
  sellWithoutStockInHands: boolean
  recommendationsEnabled: boolean
  allowAnonymousUser: boolean
  portalConfig: Record<string, any>
  trackingConfig: Record<string, any>
  search: Record<string, any>
  productPageSkip: boolean
  filters: string[]
  externals: []
  topbarTitle: string
  noteAsVendorCode: Record<string, any>
  forceSimulationByCheckout: boolean
  identificationTypesOrder: string[]
  falcoTimeToExpire: number
  isECommerce(): boolean
  toECommerce(payment: Record<string, any>): Record<string, any>
  getECommerceExecute(payment: Record<string, any>): Record<string, any>
}
interface InstoreProfileData {
  email: string
  document: string
}
interface InstoreOrderForm {
  orderFormId: string
  clientProfileData: InstoreProfileData
}
interface InstoreOrder {
  identificationType: string
  orderForm: InstoreOrderForm
}
declare type ActionType = {
  type: string
  payload: Record<string, unknown>
}
interface InstoreState {
  order: InstoreOrder
}
interface InStoreReduxStore {
  getState(): any
}
