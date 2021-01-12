import type { ProductPageQueryQuery } from '../../templates/__generated__/ProductPageQuery.graphql'
import type { ProductSummary_ProductFragment } from '../../components/ProductSummary/__generated__/ProductSummary_product.graphql'
import type { OrderFormFragment_OrderFormFragment } from '../orderForm/controller/__generated__/OrderFormFragment_orderForm.graphql'
import type { OrderFormItem } from '../orderForm/types'

export interface PageViewData {
  accountName: string
  pageTitle: string
  pageUrl: string
  referrer: string
}

export interface UserData extends PageViewData {
  firstName?: string
  lastName?: string
  document?: string
  id?: string
  email?: string
  phone?: string
  isAuthenticated: boolean
}

export interface CartIdData extends PageViewData {
  cartId: string
}

export type HomeViewData = PageViewData

export type ProductPageInfoData = PageViewData

export interface CategoryViewData extends PageViewData {
  id: string
  name: string
}

export interface DepartmentViewData extends PageViewData {
  id: string
  name: string
}

export interface InternalSiteSearchViewData extends PageViewData {
  term: string
  results: number
}

export interface AddToCartData {
  items: OrderFormItem[]
  oneClickBuy?: boolean
}

export interface RemoveFromCartData {
  items: OrderFormFragment_OrderFormFragment['items']
}

export interface CartChangedData {
  items: OrderFormFragment_OrderFormFragment['items']
}

export type OrderPlacedData = Order

export type OrderPlacedTrackedData = Order

export interface ProductViewData {
  product: ProductPageQueryQuery['vtex']['product']
}

export interface ProductClickData {
  product: ProductSummary_ProductFragment
}

export interface ProductImpressionData {
  impressions: Impression[]
  product?: ProductSummary_ProductFragment // deprecated, use impressions list!
  position?: number // deprecated, use impressions list!
  list: string
}

export interface CartLoadedData {
  orderForm: OrderFormFragment_OrderFormFragment
}

interface Order {
  accountName: string
  corporateName: string
  coupon: string
  currency: string
  openTextField: string
  orderGroup: string
  salesChannel: string
  visitorAddressCity: string
  visitorAddressComplement: string
  visitorAddressCountry: string
  visitorAddressNeighborhood: string
  visitorAddressNumber: string
  visitorAddressPostalCode: string
  visitorAddressState: string
  visitorAddressStreet: string
  visitorContactInfo: string[]
  visitorContactPhone: string
  visitorType: string
  transactionId: string
  transactionDate: string
  transactionAffiliation: string
  transactionTotal: number
  transactionShipping: number
  transactionSubtotal: number
  transactionDiscounts: number
  transactionTax: number
  transactionCurrency: string
  transactionPaymentType: PaymentType[]
  transactionShippingMethod: ShippingMethod[]
  transactionLatestShippingEstimate: Date
  transactionProducts: ProductOrder[]
  transactionPayment: {
    id: string
  }
}

interface Impression {
  product: ProductSummary_ProductFragment
  position: number
}

interface PaymentType {
  group: string
  paymentSystemName: string
  installments: number
  value: number
}

interface ShippingMethod {
  itemId: string
  selectedSla: string
}

interface ProductOrder {
  id: string
  name: string
  sku: string
  skuRefId: string
  skuName: string
  productRefId: string
  ean: string
  slug: string
  brand: string
  brandId: string
  seller: string
  sellerId: string
  category: string
  categoryId: string
  categoryTree: string[]
  categoryIdTree: string[]
  priceTags: PriceTag[]
  originalPrice: number
  price: number
  sellingPrice: number
  tax: number
  quantity: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: any[]
  measurementUnit: string
  unitMultiplier: number
}

interface PriceTag {
  identifier: string
  isPercentual: boolean
  value: number
}
