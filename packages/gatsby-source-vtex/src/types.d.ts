export interface Product {
  id: string
  slug: string
  productId: string
  productName: string
  brand: string
  brandId: number
  brandImageUrl: string
  linkText: string
  productReference: string
  categoryId: string
  productTitle: string
  metaTagDescription: string
  releaseDate: Date
  categories: string[]
  categoriesIds: string[]
  link: string
  description: string
  items: Item[]
}

export interface Item {
  itemId: string
  name: string
  nameComplete: string
  complementName: string
  ean: string
  measurementUnit: string
  unitMultiplier: number
  modalType: null
  isKit: boolean
  images: Image[]
  sellers: Seller[]
  Videos: any[]
  estimatedDateArrival: null
}

export interface Image {
  imageId: string
  imageLabel: string
  imageTag: string
  imageUrl: string
  imageText: string
  imageLastModified: Date
}

export interface Seller {
  sellerId: string
  sellerName: string
  addToCartLink: string
  sellerDefault: boolean
  commertialOffer: CommertialOffer
}

export interface CommertialOffer {
  DeliverySlaSamplesPerRegion: DeliverySlaSamplesPerRegion
  Installments: Installment[]
  DiscountHighLight: any[]
  GiftSkuIds: any[]
  Teasers: Teaser[]
  BuyTogether: any[]
  ItemMetadataAttachment: any[]
  Price: number
  ListPrice: number
  PriceWithoutDiscount: number
  RewardValue: number
  PriceValidUntil: Date
  AvailableQuantity: number
  Tax: number
  DeliverySlaSamples: DeliverySlaSample[]
  GetInfoErrorMessage: null
  CacheVersionUsedToCallCheckout: string
  PaymentOptions: PaymentOptions
}

export interface DeliverySlaSample {
  DeliverySlaPerTypes: any[]
  Region: null
}

export interface DeliverySlaSamplesPerRegion {
  '0': DeliverySlaSample
}

export interface Installment {
  Value: number
  InterestRate: number
  TotalValuePlusInterestRate: number
  NumberOfInstallments: number
  PaymentSystemName: string
  PaymentSystemGroupName: string
  Name: string
}

export interface PaymentOptions {
  installmentOptions: InstallmentOption[]
  paymentSystems: PaymentSystem[]
  payments: any[]
  giftCards: any[]
  giftCardMessages: any[]
  availableAccounts: any[]
  availableTokens: any[]
}

export interface InstallmentOption {
  paymentSystem: string
  bin: null
  paymentName: string
  paymentGroupName: string
  value: number
  installments: InstallmentElement[]
}

export interface InstallmentElement {
  count: number
  hasInterestRate: boolean
  interestRate: number
  value: number
  total: number
  sellerMerchantInstallments: InstallmentElement[]
  id: string
}

export interface PaymentSystem {
  id: number
  name: string
  groupName: string
  validator: null
  stringId: string
  template: string
  requiresDocument: boolean
  isCustom: boolean
  description: null | string
  requiresAuthentication: boolean
  dueDate: Date
  availablePayments: null
}

export interface Teaser {
  '<Name>k__BackingField': string
  '<Conditions>k__BackingField': ConditionsKBackingField
  '<Effects>k__BackingField': EffectsKBackingField
}

export interface ConditionsKBackingField {
  '<MinimumQuantity>k__BackingField': number
  '<Parameters>k__BackingField': ParametersKBackingField[]
}

export interface ParametersKBackingField {
  '<Name>k__BackingField': string
  '<Value>k__BackingField': string
}

export interface EffectsKBackingField {
  '<Parameters>k__BackingField': ParametersKBackingField[]
}

export interface Category {
  slug: string
  categoryId: number
  id: number
  name: string
  hasChildren: boolean
  url: string
  children: Category[]
  Title: null | string
  MetaTagDescription: string
}
