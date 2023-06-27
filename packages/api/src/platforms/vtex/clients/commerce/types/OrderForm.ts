export interface OrderFormInputItem {
  id: string
  quantity: number
  seller: string
  index?: number
  attachments?: Attachment[]
}

export interface Attachment {
  name: string
  content: Record<string, string>
}

export interface OrderFormItem {
  id: string
  name: string
  detailUrl: string
  imageUrl: string
  skuName: string
  quantity: number
  uniqueId: string
  productId: string
  refId: string
  ean: string
  priceValidUntil: string
  price: number
  tax: number
  listPrice: number
  sellingPrice: number
  rewardValue: number
  isGift: boolean
  parentItemIndex: number | null
  parentAssemblyBinding: string | null
  productCategoryIds: string
  priceTags: string[]
  manualPrice: number
  measurementUnit: string
  additionalInfo: {
    brandName: string
    brandId: string
    offeringInfo: any | null
    offeringType: any | null
    offeringTypeId: any | null
  }
  productCategories: Record<string, string>
  productRefId: string
  seller: string
  sellerChain: string[]
  availability: string
  unitMultiplier: number
  skuSpecifications: SKUSpecification[]
  priceDefinition: {
    calculatedSellingPrice: number
    sellingPrices: SellingPrice[]
    total: number
  }
  attachments: Attachment[]
}

export interface SKUSpecification {
  fieldName: string
  fieldValues: string[]
}

export interface AdditionalInfo {
  dimension: null
  brandName: string
  brandId: string
  offeringInfo: null
  offeringType: null
  offeringTypeId: null
}

export interface PriceDefinition {
  calculatedSellingPrice: number
  total: number
  sellingPrices: SellingPrice[]
}

export interface SellingPrice {
  value: number
  quantity: number
}

export interface PriceTag {
  name: string
  value: number
  rawValue: number
  isPercentual: boolean
  identifier: string
}

export interface OrderForm {
  orderFormId: string
  salesChannel: string
  loggedIn: boolean
  isCheckedIn: boolean
  storeId: string | null
  checkedInPickupPointId: string | null
  allowManualPrice: boolean
  canEditData: boolean
  userProfileId: string | null
  userType: string | null
  ignoreProfileData: boolean
  value: number
  messages: any[]
  items: OrderFormItem[]
  selectableGifts: any[]
  totalizers: Array<{
    id: string
    name: string
    value: number
  }>
  shippingData: ShippingData | null
  clientProfileData: ClientProfileData | null
  paymentData: PaymentData
  marketingData: OrderFormMarketingData | null
  sellers: Array<{
    id: string
    name: string
    logo: string
  }>
  clientPreferencesData: {
    locale: string
    optinNewsLetter: any | null
  }
  commercialConditionData: any | null
  storePreferencesData: {
    countryCode: string
    currencyCode: string
    currencyFormatInfo: {
      currencyDecimalDigits: number
      currencyDecimalSeparator: string
      currencyGroupSeparator: string
      currencyGroupSize: number
      startsWithCurrencySymbol: boolean
    }
    currencyLocale: string
    currencySymbol: string
    saveUserData: boolean
    timeZone: string
  }
  giftRegistryData: any | null
  openTextField: any | null
  invoiceData: any | null
  customData: OrderFormCustomData | null
  itemMetadata: {
    items: MetadataItem[]
  }
  hooksData: any | null
  ratesAndBenefitsData: {
    rateAndBenefitsIdentifiers: any[]
    teaser: any[]
  }
  subscriptionData: SubscriptionData | null
  itemsOrdination: any | null
}

export interface OrderFormCustomData {
  customApps: Array<{
    fields: Record<string, string>
    id: string
    major: number
  }>
}

export interface OrderFormMarketingData {
  utmCampaign?: string
  utmMedium?: string
  utmSource?: string
  utmiCampaign?: string
  utmiPart?: string
  utmipage?: string
  marketingTags?: string
  coupon?: string
}

export interface PaymentData {
  installmentOptions: Array<{
    paymentSystem: string
    bin: string | null
    paymentName: string | null
    paymentGroupName: string | null
    value: number
    installments: Array<{
      count: number
      hasInterestRate: false
      interestRate: number
      value: number
      total: number
      sellerMerchantInstallments: Array<{
        count: number
        hasInterestRate: false
        interestRate: number
        value: number
        total: number
      }>
    }>
  }>
  paymentSystems: Array<{
    id: string
    name: string
    groupName: string
    validator: {
      regex: string
      mask: string
      cardCodeRegex: string
      cardCodeMask: string
      weights: number[]
      useCvv: boolean
      useExpirationDate: boolean
      useCardHolderName: boolean
      useBillingAddress: boolean
    }
    stringId: string
    template: string
    requiresDocument: boolean
    isCustom: boolean
    description: string | null
    requiresAuthentication: boolean
    dueDate: string
    availablePayments: any | null
  }>
  payments: any[]
  giftCards: any[]
  giftCardMessages: any[]
  availableAccounts: any[]
  availableTokens: any[]
}

export interface ClientProfileData {
  email: string
  firstName: string
  lastName: string
  document: string
  documentType: string
  phone: string
  corporateName: string
  tradeName: string
  corporateDocument: string
  stateInscription: string
  corporatePhone: string
  isCorporate: boolean
  profileCompleteOnLoading: boolean
  profileErrorOnLoading: boolean
  customerClass: string
}

export interface ShippingData {
  address: CheckoutAddress | null
  logisticsInfo: LogisticsInfo[]
  selectedAddresses: CheckoutAddress[]
  availableAddresses: CheckoutAddress[]
  pickupPoints: PickupPoint[]
}

export interface PickupPoint {
  friendlyName: string
  address: CheckoutAddress
  additionalInfo: string
  id: string
  businessHours: BusinessHour[]
}

export interface BusinessHour {
  DayOfWeek: number
  ClosingTime: string
  OpeningTime: string
}

export interface LogisticsInfo {
  addressId: string | null
  deliveryChannels: DeliveryChannel[]
  itemId: string
  itemIndex: number
  shipsTo: string[]
  slas: SLA[]
  selectedDeliveryChannel: string | null
  selectedSla: string | null
}

export interface SLA {
  id: string
  deliveryChannel: string
  name: string
  deliveryIds: DeliveryId[]
  shippingEstimate: string
  shippingEstimateDate: string | null
  lockTTL: string | null
  availableDeliveryWindows: AvailableDeliveryWindows[]
  deliveryWindow: DeliveryWindow  | null
  price: number
  listPrice: number
  tax: number
  pickupStoreInfo: {
    isPickupStore: boolean
    friendlyName: string | null
    address: CheckoutAddress | null
    additionalInfo: any | null
    dockId: string | null
  }
  pickupPointId: string | null
  pickupDistance: number | null
  polygonName: string | null
  transitTime: string | null
}

export interface DeliveryWindow {
  startDateUtc: string
  endDateUtc: string
}

export interface AvailableDeliveryWindows {
  startDateUtc: string,
  endDateUtc: string,
  price: number,
  listPrice: number,
  tax: number,
}

export interface DeliveryId {
  courierId: string
  warehouseId: string
  dockId: string
  courierName: string
  quantity: number
}

export interface DeliveryChannel {
  id: string
}

export interface CheckoutAddress {
  addressId: string
  addressType: string
  city: string | null
  complement: string | null
  country: string
  geoCoordinates: number[]
  neighborhood: string | null
  number: string | null
  postalCode: string | null
  receiverName: string | null
  reference: string | null
  state: string | null
  street: string | null
  isDisposable: boolean
}

export interface MetadataItem {
  id: string
  name: string
  imageUrl: string
  detailUrl: string
  seller: string
  assemblyOptions: AssemblyOption[]
  skuName: string
  productId: string
  refId: string
  ean: string | null
}

export interface AssemblyOption {
  id: string
  name: string
  composition: Composition | null
}

export interface SubscriptionDataEntry {
  executionCount: number
  itemIndex: number
  plan: {
    frequency: {
      interval: number
      periodicity: 'YEAR' | 'MONTH' | 'WEEK' | 'DAY'
    }
    type: string
    validity: unknown
  }
}

export interface CompositionItem {
  id: string
  minQuantity: number
  maxQuantity: number
  initialQuantity: number
  priceTable: string
  seller: string
}

export interface Composition {
  minQuantity: number
  maxQuantity: number
  items: CompositionItem[]
}

export interface SubscriptionData {
  subscriptions: SubscriptionDataEntry[]
}
