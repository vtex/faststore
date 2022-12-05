export interface ShippingItem {
  id: string
  quantity: number
  seller: string
  parentItemIndex?: number | null
  parentAssemblyBinding?: string | null
}

export interface ShippingData {
  logisticsInfo?: Array<{ regionId?: string | null }>
}

export interface SimulationArgs {
  country?: string
  items: ShippingItem[]
  postalCode?: string
  isCheckedIn?: boolean
  priceTables?: string[]
  marketingData?: Record<string, string>
  shippingData?: ShippingData
}

export interface SimulationOptions {
  salesChannel: string
}

export interface Simulation {
  items: Item[]
  ratesAndBenefitsData: RatesAndBenefitsData
  paymentData: PaymentData
  selectableGifts: any[]
  marketingData: MarketingData
  postalCode: null
  country: null
  logisticsInfo: LogisticsInfo[]
  messages: any[]
  purchaseConditions: PurchaseConditions
  pickupPoints: any[]
  subscriptionData: null
  totals: Total[]
  itemMetadata: null
}

export interface Item {
  id: string
  requestIndex: number
  quantity: number
  seller: string
  sellerChain: string[]
  tax: number
  priceValidUntil: Date
  price: number
  listPrice: number
  rewardValue: number
  sellingPrice: number
  offerings: any[]
  priceTags: any[]
  measurementUnit: string
  unitMultiplier: number
  parentItemIndex: null
  parentAssemblyBinding: null
  availability: string
  catalogProvider: string
  priceDefinition: PriceDefinition
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

export interface LogisticsInfo {
  itemIndex: number
  addressId: null
  selectedSla: null
  selectedDeliveryChannel: null
  quantity: number
  shipsTo: string[]
  slas: any[]
  deliveryChannels: DeliveryChannel[]
}

export interface DeliveryChannel {
  id: string
}

export interface MarketingData {
  utmSource: null
  utmMedium: null
  utmCampaign: null
  utmipage: null
  utmiPart: null
  utmiCampaign: null
  coupon: null
  marketingTags: string[]
}

export interface PaymentData {
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
  installments: Installment[]
}

export interface Installment {
  count: number
  hasInterestRate: boolean
  interestRate: number
  value: number
  total: number
  sellerMerchantInstallments?: Installment[]
  id?: string
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

export interface PurchaseConditions {
  itemPurchaseConditions: ItemPurchaseCondition[]
}

export interface ItemPurchaseCondition {
  id: string
  seller: string
  sellerChain: string[]
  slas: any[]
  price: number
  listPrice: number
}

export interface RatesAndBenefitsData {
  rateAndBenefitsIdentifiers: any[]
  teaser: any[]
}

export interface Total {
  id: string
  name: string
  value: number
}
