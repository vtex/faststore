// Types mirroring the fastcheckout BFF GraphQL schema

export interface PriceValue {
  asCurrency: string
  asNumber: number
}

export type TagType = 'PERCENT' | 'CURRENCY'

export interface Tag {
  id: string
  value: string
  type: TagType
}

export interface ProductSeller {
  id: string
  name: string
}

export interface ProductCategory {
  id: string
  name: string
}

export interface Price {
  __typename: 'Price'
  total: string
  value: PriceValue
}

export interface PriceWithDiscount {
  __typename: 'PriceWithDiscount'
  total: string
  value: PriceValue
  originalValue: string
  valueWithDiscount: PriceValue
}

export type ProductPriceUnion = Price | PriceWithDiscount

export interface Offering {
  id: string
  name: string
  price: PriceValue
  type: string
  allowGiftMessage: boolean
}

export interface CostCenter {
  id: string
  name: string
}

export interface Attachment {
  name: string
  content: Record<string, string>
}

export interface CompositionItem {
  id: string
  name: string
  imageUrl: string
  quantity: number
}

export interface CompositionGroup {
  id: string
  name: string
  items: CompositionItem[]
  maxQuantity: number
  minQuantity: number
}

export type ProductMeasurementUnit = 'UN' | 'KG'

export interface ShippingDate {
  __typename?: 'ShippingDate'
  day: number
  month: string
  weekDay: string
  inHours: number
  inBusinessDays: number
}

export interface RangeShippingDate {
  __typename: 'RangeShippingDate'
  earlyDate: ShippingDate
  lastDate: ShippingDate
}

export type ShippingDateUnion = ShippingDate | RangeShippingDate

export interface ProductDeliveryOption {
  __typename: 'ProductDeliveryOption'
  id: string
  optionId: string
  name: string
  price: PriceValue
  estimateDate: ShippingDateUnion
}

export interface ProductPickupOption {
  __typename: 'ProductPickupOption'
  id: string
  optionId: string
  name: string
  price: PriceValue
  estimateDate: ShippingDateUnion
}

export type ProductShippingOption = ProductDeliveryOption | ProductPickupOption

export interface ProductShippingOptionAvailable {
  id: string
  optionId: string
  name: string
}

export interface Product {
  id: string
  name: string
  imageUrl: string
  quantity: number
  price: ProductPriceUnion
  tags: Tag[]
  measurementUnit?: ProductMeasurementUnit
  originalIndex: number
  seller: ProductSeller
  itemId: string
  productId: string
  skuName: string
  brandName: string | null
  categories: ProductCategory[] | null
  productUrl: string
  offerings: Offering[]
  costCenter: CostCenter | null
  selectedShippingOption?: ProductShippingOption | null
  shippingOptions?: ProductShippingOptionAvailable[]
  compositions: CompositionGroup[]
  compositionCount: number
  itemValue: ProductPriceUnion
  attachments: Attachment[]
}

export interface BaseProductUnavailable {
  id: string
  name: string
  imageUrl: string
  quantity: number
  originalIndex: number
  itemId: string
  price: ProductPriceUnion | null
  itemPrice: ProductPriceUnion | null
  skuName: string
  brandName: string | null
  productId: string
  categories: ProductCategory[] | null
  productUrl: string
  offerings: Offering[]
  compositionCount: number
  compositions: CompositionGroup[]
  attachments: Attachment[]
}

// Cart
export interface Cart {
  __typename: 'Cart'
  id: string
  total: string
  availableItems: Product[]
  unavailableItems: BaseProductUnavailable[]
  totalItems: number
  salesChannel: string
}

export interface EmptyCart {
  __typename: 'EmptyCart'
  id: string
}

export type CartUnion = Cart | EmptyCart

// Summary
export interface ShippingTotalizer {
  __typename: 'ShippingTotalizer'
  value: string
  value_v2: PriceValue
}

export interface FreeShippingTotalizer {
  __typename: 'FreeShippingTotalizer'
  type: 'FREE_SHIPPING_TOTALIZER'
}

export interface ToBeCalculatedShippingTotalizer {
  __typename: 'ToBeCalculatedShippingTotalizer'
  type: 'TO_BE_CALCULATED_SHIPPING_TOTALIZER'
}

export type ShippingTotalizerUnion =
  | ShippingTotalizer
  | FreeShippingTotalizer
  | ToBeCalculatedShippingTotalizer

export interface GiftCardTotalizerItem {
  redemptionCode: string
  value: PriceValue
}

export interface GiftCardTotalizer {
  count: number
  total: PriceValue
  items: GiftCardTotalizerItem[]
}

export interface SummaryTotalizers {
  items?: string
  shipping: ShippingTotalizerUnion
  customTax?: string
  customTax_v2?: PriceValue
  discounts?: string
  discounts_v2?: PriceValue
}

export interface Summary {
  id: string
  totalizers: SummaryTotalizers
  giftCardTotalizer?: GiftCardTotalizer
  total: PriceValue
}

// Coupon
export interface PromoCode {
  value: string
  isUnmatchedCondition: boolean
}

export interface Coupon {
  __typename: 'Coupon'
  id: string
  promoCodes: PromoCode[]
}

export interface EmptyCoupon {
  __typename: 'EmptyCoupon'
  id: string
}

export type CouponUnion = Coupon | EmptyCoupon

// Shipping
export type ShippingMode = 'DELIVERY' | 'PICKUP' | 'MULTIDELIVERY' | 'EMPTY'
export type DeliveryChannel = 'DELIVERY' | 'PICKUP'

export interface ShippingAddress {
  addressId: string | null
  addressType: string | null
  street: string | null
  number: string | null
  city: string | null
  postalCode: string | null
  state: string | null
  receiverName: string | null
  country: string | null
  neighborhood: string | null
  complement: string | null
  reference: string | null
  geoCoordinates: number[] | null
}

export interface ShippingMethod {
  name: string
  total: PriceValue
}

export interface MultiSlaShippingDates {
  earlyDate: ShippingDate
  lastDate: ShippingDate
}

export interface DeliveryWindow {
  id: string
  optionId: string
  startDateUtc: string
  endDateUtc: string
  price: PriceValue
  listPrice: PriceValue
  tax: PriceValue
}

export interface PackageModel {
  id: string
  slaId: string
  estimateDate: ShippingDate
  totalItems: number
  items: Product[]
  shippingMethod: ShippingMethod
  availableDeliveryWindows: DeliveryWindow[]
  selectedDeliveryWindow: DeliveryWindow | null
}

export interface SingleSlaDelivery {
  __typename: 'SingleSlaDelivery'
  id: string
  total: PriceValue
  items: Product[]
  estimateDate: ShippingDate
  name: string
  availableDeliveryWindows: DeliveryWindow[]
  selectedDeliveryWindow: DeliveryWindow | null
}

export interface MultiSlaDelivery {
  __typename: 'MultiSlaDelivery'
  id: string
  total: PriceValue
  totalPackages: number
  estimateDates: MultiSlaShippingDates
  packages: PackageModel[]
  shippingMethods: ShippingMethod[]
}

export type DeliverySla = SingleSlaDelivery | MultiSlaDelivery

export interface EmptyDelivery {
  __typename: 'EmptyDelivery'
  id: string
}

export interface NoSlasDelivery {
  __typename: 'NoSlasDelivery'
  id: string
  address: ShippingAddress
}

export interface Delivery {
  __typename: 'Delivery'
  id: string
  selected: DeliverySla
  options: DeliverySla[]
  address: ShippingAddress
}

export interface PreviewDelivery {
  __typename: 'PreviewDelivery'
  id: string
  bestOptions: SingleSlaDelivery
  address: ShippingAddress
}

export type DeliveryUnion =
  | EmptyDelivery
  | NoSlasDelivery
  | Delivery
  | PreviewDelivery

export interface ShippingOptionTotalizers {
  items: PriceValue
  shipping: PriceValue
  total: PriceValue
}

export interface PickupOptionPackage {
  estimateDate: ShippingDate
  slaId: string
  total: number
  items: Product[]
  totalItems: number
}

export interface BusinessHour {
  day: number
  openingTime: string
  closingTime: string
}

export interface ProductUnavailableForPickup {
  id: string
  name: string
  imageUrl: string
}

export interface PickupOption {
  id: string
  pickupPointId: string
  name: string
  address: ShippingAddress
  distance: string
  businessHours?: BusinessHour[]
  earliestEstimateDate?: ShippingDate
  estimateDate: ShippingDate
  availableItems: Product[]
  packages: PickupOptionPackage[]
  selectedPackages: PickupOptionPackage[]
  unavailableItems: ProductUnavailableForPickup[]
  isValid: boolean
  slaId: string
  totalItems: number
  totalizers: ShippingOptionTotalizers
  selectedPackagesTotalizers: ShippingOptionTotalizers
}

export interface EmptyPickup {
  __typename: 'EmptyPickup'
  id: string
}

export interface Pickup {
  __typename: 'Pickup'
  id: string
  selected: PickupOption
  options: PickupOption[]
  addressQuery: string
  address: ShippingAddress
}

export interface PreviewPickup {
  __typename: 'PreviewPickup'
  id: string
  bestOption: PickupOption
  options: PickupOption[]
  addressQuery: string
  address: ShippingAddress
}

export interface NoSlasPickup {
  __typename: 'NoSlasPickup'
  id: string
  address: ShippingAddress
}

export type PickupUnion = EmptyPickup | Pickup | PreviewPickup | NoSlasPickup

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
}

export interface Shipping {
  id: string
  delivery: DeliveryUnion
  pickup: PickupUnion
  deliveryChannels: DeliveryChannel[]
  mode: ShippingMode
}

// One-click checkout
export interface OneClickCheckoutOptions {
  applePay: boolean
  googlePay: boolean
}

// Store preferences
export interface StorePreferences {
  id: string
  currency: string
  country: string
}

// Auth
export interface Auth {
  isAuthenticated: boolean
}

// Customer
export interface CustomerPerson {
  __typename: 'Person'
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface CustomerOrganization {
  __typename: 'Organization'
  id: string
  name: string
}

export type Customer = CustomerPerson | CustomerOrganization

// Comment (B2B)
export interface Comment {
  id: string
  value: string
}

// Custom fields
export interface CustomFields {
  id: string
}

// Payload errors
export interface CheckoutAPIError {
  __typename: 'CheckoutAPIError'
  message: string
  code: string
  operationId: string
}

export interface InvalidPromoCodeError {
  __typename: 'InvalidPromoCodeError'
  message: string
}

export interface ExpiredPromoCodeError {
  __typename: 'ExpiredPromoCodeError'
  message: string
}

export type PromoCodeError =
  | InvalidPromoCodeError
  | ExpiredPromoCodeError
  | CheckoutAPIError

// Full page query response
export interface CartPageData {
  cart: CartUnion
  summary: Summary
  shipping: Shipping
  coupon: CouponUnion
  storePreferences: StorePreferences
  oneClickCheckoutOptions: OneClickCheckoutOptions
  auth: Auth
  customer: Customer
  comment: Comment
  customFields: CustomFields
}

// Mutation payloads
export interface ChangeProductQuantityPayload {
  cart?: CartUnion
  summary?: Summary
  coupon?: CouponUnion
  shipping?: Shipping
  errors: CheckoutAPIError[]
}

export interface RemoveProductsPayload {
  cart?: CartUnion
  summary?: Summary
  coupon?: CouponUnion
  shipping?: Shipping
  errors: CheckoutAPIError[]
}

export interface RemoveAllProductsPayload {
  cart?: CartUnion
  summary?: Summary
  coupon?: CouponUnion
  errors: CheckoutAPIError[]
}

export interface AddPromoCodePayload {
  cart?: CartUnion
  summary?: Summary
  coupon?: CouponUnion
  errors: PromoCodeError[]
}

export interface ChangePromoCodesPayload {
  coupon?: CouponUnion
  cart?: CartUnion
  summary?: Summary
  errors: PromoCodeError[]
}

export interface SelectDeliveryChannelPayload {
  shipping?: Shipping
  cart?: CartUnion
  summary?: Summary
  errors: CheckoutAPIError[]
}

export interface SelectSingleSlaPayload {
  shipping?: Shipping
  cart?: CartUnion
  summary?: Summary
  errors: CheckoutAPIError[]
}

export interface SelectAddressPayload {
  shipping?: Shipping
  cart?: CartUnion
  summary?: Summary
  errors: CheckoutAPIError[]
}
