export interface Tenant {
  id: string
  slug: string
  title: string
  edition: string
  infra: string
  bindings: Channel[]
  defaultCurrency: string
  defaultLocale: string
  metadata: Record<string, unknown>
}

export interface Channel {
  id: string
  canonicalBaseAddress: string
  alternateBaseAddresses: string[]
  defaultLocale: string
  supportedLocales: string[]
  defaultCurrency: string
  supportedCurrencies: string[]
  extraContext: ExtraContext
  targetProduct: string
}

export interface ExtraContext {
  portal?: Portal
}

export interface Portal {
  salesChannel: number
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
  LinkId: string
}

export interface Brand {
  id: number
  name: string
  isActive: boolean
  title: string
  metaTagDescription: string
  imageUrl: string | null
}

export interface PageType {
  id: string
  name: string
  url: string
  title: string
  metaTagDescription: string
  pageType:
    | 'Product'
    | 'SubCategory'
    | 'Department'
    | 'Category'
    | 'Brand'
    | 'FullText'
    | 'NotFound'
}

export type Sort =
  | 'OrderByPriceDESC'
  | 'OrderByPriceASC'
  | 'OrderByTopSaleDESC'
  | 'OrderByReviewRateDESC'
  | 'OrderByNameASC'
  | 'OrderByNameDESC'
  | 'OrderByReleaseDateDESC'
  | 'OrderByBestDiscountDESC'
  | 'OrderByScoreDESC'
  | ''
