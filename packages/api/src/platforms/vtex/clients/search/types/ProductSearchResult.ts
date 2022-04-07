export interface ProductSearchResult {
  /**
   * @description Total of products.
   */
  recordsFiltered: number
  products: Product[]
  pagination: Pagination
  sampling: boolean
  options: Options
  translated: boolean
  locale: string
  query: string
  operator: string
  fuzzy: string
  correction: Correction
}

interface Correction {
  misspelled: boolean
}

interface Options {
  sorts: Sort[]
  counts: Count[]
}

interface Count {
  count: number
  proxyURL: string
}

interface Sort {
  field: string
  order: string
  active?: boolean
  proxyURL: string
}

interface Pagination {
  count: number
  current: Page
  before: Page[]
  after: Page[]
  perPage: number
  next: Page
  previous: Page
  first: Page
  last: Page
}

interface Page {
  index: number
  proxyURL: string
}

export interface Product {
  productId: string
  productName: string
  brand: string
  brandId: number
  cacheId?: string
  linkText: string
  productReference: string
  categoryId: string
  clusterHighlights: Record<string, any>
  productClusters: Record<string, string>
  categories: string[]
  categoriesIds: string[]
  link: string
  description: string
  /**
   * @description Product SKUs.
   */
  items: Item[]
  skuSpecifications?: SkuSpecification[]
  priceRange: PriceRange
  specificationGroups: SpecificationGroup
  properties: Array<{ name: string; values: string[] }>
  selectedProperties: Array<{ key: string; value: string }>
}

interface Image {
  imageId: string
  imageLabel: string | null
  imageTag: string
  imageUrl: string
  imageText: string
}

interface Installment {
  Value: number
  InterestRate: number
  TotalValuePlusInterestRate: number
  NumberOfInstallments: number
  PaymentSystemName: string
  PaymentSystemGroupName: string
  Name: string
}

export interface Item {
  itemId: string
  name: string
  nameComplete: string
  complementName: string
  ean: string
  referenceId: Array<{ Key: string; Value: string }>
  measurementUnit: string
  unitMultiplier: number
  modalType: any | null
  images: Image[]
  Videos: string[]
  variations: string[]
  sellers: Seller[]
  attachments: Array<{
    id: number
    name: string
    required: boolean
    domainValues: string
  }>
  isKit: boolean
  kitItems?: Array<{
    itemId: string
    amount: number
  }>
}

export interface CommertialOffer {
  DeliverySlaSamplesPerRegion: Record<
    string,
    { DeliverySlaPerTypes: any[]; Region: any | null }
  >
  Installments: Installment[]
  DiscountHighLight: any[]
  GiftSkuIds: string[]
  Teasers: Array<Record<string, unknown>>
  teasers?: Array<Record<string, unknown>>
  BuyTogether: any[]
  ItemMetadataAttachment: any[]
  Price: number
  ListPrice: number
  spotPrice?: number
  PriceWithoutDiscount: number
  RewardValue: number
  PriceValidUntil: string
  AvailableQuantity: number
  Tax: number
  DeliverySlaSamples: Array<{
    DeliverySlaPerTypes: any[]
    Region: any | null
  }>
  GetInfoErrorMessage: any | null
  CacheVersionUsedToCallCheckout: string
}

export interface Seller {
  sellerId: string
  sellerName: string
  addToCartLink: string
  sellerDefault: boolean
  commertialOffer: CommertialOffer
}

interface SkuSpecification {
  field: SKUSpecificationField
  values: SKUSpecificationValue[]
}
interface SKUSpecificationValue {
  name: string
  id?: string
  fieldId?: string
  originalName?: string
}

interface SKUSpecificationField {
  name: string
  originalName?: string
  id?: string
}

interface PriceRange {
  sellingPrice: { highPrice: number; lowPrice: number }
  listPrice: { highPrice: number; lowPrice: number }
}

interface SpecificationGroup {
  name: string
  originalName: string
  specifications: { name: string; originalName: string; values: string[] }
}
