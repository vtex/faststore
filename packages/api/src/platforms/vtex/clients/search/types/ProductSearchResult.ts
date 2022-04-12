export interface ProductSearchResult {
  total: number
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

export interface Correction {
  misspelled: boolean
}

export interface Options {
  sorts: Sort[]
  counts: Count[]
}

export interface Count {
  count: number
  proxyURL: string
}

export interface Sort {
  field: string
  order: string
  active?: boolean
  proxyURL: string
}

export interface Pagination {
  count: number
  current: Current
  before: any[]
  after: Current[]
  perPage: number
  next: Current
  previous: First
  first: First
  last: Current
}

export interface Current {
  index: number
  proxyURL: string
}

export interface First {
  index: number
}

export interface Product {
  unitMultiplier: number
  year: number
  extraData: ExtraDatum[]
  release: number
  discount: number
  reference: string
  split: Split
  collections: Collection[]
  price: number
  customSort: number
  stickers: Sticker[]
  id: string
  stock: number
  brand: string
  availableTradePolicies: string[]
  categoryTrees: CategoryTree[]
  images: Image[]
  locationAttributes: any[]
  tax: number
  productScore: number
  storeSplitAttribute: string
  brandID: string
  installment: Installment
  name: string
  boost: Boost
  skus: Sku[]
  link: string
  wear: number
  description: string
  showIfNotAvailable: boolean
  clusterHighlights: ClusterHighlights
  categories: string[]
  timestamp: number
  product: string
  oldPrice: number
  productSpecifications: string[]
  url: string
  measurementUnit: string
  categoryIDS: string[]
  textAttributes: TextAttribute[]
  numberAttributes: NumberAttribute[]
  headSku: string
  specificationGroups: string
  extraInfo: ExtraInfo
  oldPriceText: string
  priceText: string
}

export interface Boost {
  newness: number
  image: number
  revenue: number
  discount: number
  productScore: number
  click: number
  availableSpecsCount: number
  promotion: number
  order: number
}

export interface CategoryTree {
  categoryNames: string[]
  categoryIDS: string[]
}

export interface ClusterHighlights {
  the140: string
}

export interface Collection {
  id: string
  position: number
}

export interface ExtraDatum {
  value: string
  key: string
}

export interface ExtraInfo {
  sellerID: string
}

export interface Image {
  name: string
  value: string
}

export interface Installment {
  interest: boolean
  count: number
  paymentGroupName: string
  value: number
  paymentName: string
  valueText?: string
}

export interface NumberAttribute {
  labelKey: string
  value: number
  key: string
}

export interface Sku {
  images: Image[]
  nameComplete: string
  complementName: string
  policies: Policy[]
  videos: any[]
  reference: string
  idWithSplit: string
  ean: string
  name: string
  attributes: ExtraDatum[]
  id: string
  sellers: Seller[]
  specificationGroups:String,
  textAttributes:any[],
  productSpecifications:any[]
}

export interface Policy {
  id: string
  sellers: Seller[]
}

export interface Seller {
  default: boolean
  oldPrice?: number
  price?: number
  installment?: Installment
  name: string
  tax: number
  teasers: any[]
  id: string
}

export interface Split {
  labelValue: string
  labelKey: string
}

export interface Sticker {
  image: string
  name: string
  location: string
  target: string
}

export interface TextAttribute {
  joinedValue: string
  isSku: boolean
  joinedKey: string
  joinedKeyTranslations: JoinedTranslations
  isFilter: boolean
  labelValue: string
  id: string[]
  labelKey: string
  value: string
  key: string
  joinedValueTranslations: JoinedTranslations
  valueID?: string
  originalLabelKey?:string
  originalLabelValue?:string
}

export interface JoinedTranslations {
  spanish: string
  english: string
  italian: string
}
