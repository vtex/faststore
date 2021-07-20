import { useMemo } from 'react'

import type { ProductSummary_ProductFragment } from '../../components/ProductSummary/__generated__/ProductSummary_product.graphql'
import type { OrderFormFragment_OrderFormFragment } from '../orderForm/controller/__generated__/OrderFormFragment_orderForm.graphql'
import { getBestSeller } from '../product/useBestSeller'
import { useSku } from '../product/useSku'

export function minimalToPixelProduct(
  product: MinimalProduct,
  sku: MinimalSKU
): PixelProduct {
  return {
    productId: product.id,
    productReferenceId: product.productReference,
    productName: product.productName,
    brand: product.brand,
    categoryTree: product.categoryTree,
    price: getBestSeller(sku)?.commercialOffer.price,
    skuId: sku.itemId,
    skuName: sku.name,
    skuReferenceId: sku.referenceId,
  } as PixelProduct
}

export function useMinimalToPixelProduct(product: MinimalProduct) {
  const [sku] = useSku(product)

  return useMemo(() => minimalToPixelProduct(product, sku), [product, sku])
}

export interface PageViewData {
  accountName: string
  pageTitle: string
  pageUrl: string
  referrer: string
  pageType: 'home' | 'fullText' | 'pdp' | 'plp'
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
  products: CartPixelProduct[]
  oneClickBuy?: boolean
}

export interface RemoveFromCartData {
  products: CartPixelProduct[]
}

export interface CartChangedData {
  items: OrderFormFragment_OrderFormFragment['items']
}

export type OrderPlacedData = Order

export type OrderPlacedTrackedData = Order

export interface ProductViewData {
  product: any
}

export interface ProductClickData {
  product: PixelProduct
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

export interface ProductOrder {
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

export interface PixelProduct {
  productId: string
  productReferenceId: Maybe<string>
  productName: string
  brand: string
  categoryTree: Array<{ name: string }>
  price: number
  // TODO currencyCode
  skuId: string
  skuName: string
  skuReferenceId: Maybe<Array<{ value: Maybe<string> }>>
}

export interface CartPixelProduct extends PixelProduct {
  quantity: number
}

interface MinimalSeller {
  /**
   * Seller's commercial offer. It contains price and availability information.
   *
   * @type {object}
   * @memberof Seller
   */
  commercialOffer: {
    /**
     * Price of a seller's SKU.
     *
     * @type {number}
     */
    price: number
  }
}

export interface MinimalSKU {
  /**
   * SKU id.
   *
   * @type {string}
   * @memberof SKU
   */
  itemId: string
  /**
   * SKU sellers.
   *
   * @type {MinimalSeller[]}
   * @memberof SKU
   */
  sellers: MinimalSeller[]
  /**
   * SKU reference id. May be an array of objects with possibly `null` value properties.
   *
   * @type {Maybe<Array<{ value: Maybe<string> }>>}
   * @memberof SKU
   */
  referenceId: Maybe<Array<{ value: Maybe<string> }>>
  /**
   * SKU name. Doesn't include the product name.
   *
   * @type {string}
   * @memberof SKU
   */
  name: string
}

export interface MinimalProduct {
  /**
   * Product id.
   *
   * @type {string}
   * @memberof Product
   */
  id: string
  /**
   * Product name. Doesn't include the SKU name.
   *
   * @type {string}
   * @memberof Product
   */
  productName: string
  /**
   * Product brand.
   *
   * @type {string}
   * @memberof Product
   */
  brand: string
  /**
   * Product's category tree. Each category must have a name.
   *
   * @type {Array<{ name: string }>}
   * @memberof Product
   */
  categoryTree: Array<{ name: string }>
  /**
   * Product reference id.
   *
   * @type {Maybe<string>}
   * @memberof Product
   */
  productReference: Maybe<string>
  /**
   * Product's SKU list.
   *
   * @type {MinimalSKU[]}
   * @memberof MinimalProduct
   */
  items: MinimalSKU[]
}
