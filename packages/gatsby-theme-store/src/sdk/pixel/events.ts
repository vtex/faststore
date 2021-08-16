import { useMemo } from 'react'
import type { AnalyticsProduct } from '@vtex/store-sdk'

import { getBestSeller } from '../product/useBestSeller'
import { useSku } from '../product/useSku'

export function minimalToAnalyticsProduct(
  product: MinimalProduct,
  sku: MinimalSKU
): AnalyticsProduct {
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
  } as AnalyticsProduct
}

export function useMinimalToAnalyticsProduct(product: MinimalProduct) {
  const [sku] = useSku(product)

  return useMemo(() => minimalToAnalyticsProduct(product, sku), [product, sku])
}

export interface CartPixelProduct extends AnalyticsProduct {
  quantity: number
}

interface MinimalCommercialOffer {
  /**
   * Price of a seller's SKU.
   *
   * @type {number}
   * @memberof MinimalCommercialOffer
   */
  price: number
}

interface MinimalSeller {
  /**
   * Seller's commercial offer. It contains price and availability information.
   *
   * @type {MinimalCommercialOffer}
   * @memberof MinimalSeller
   */
  commercialOffer: MinimalCommercialOffer
}

export interface MinimalSKU {
  /**
   * SKU id.
   *
   * @type {string}
   * @memberof MinimalSKU
   */
  itemId: string
  /**
   * SKU sellers.
   *
   * @type {MinimalSeller[]}
   * @memberof MinimalSKU
   */
  sellers: MinimalSeller[]
  /**
   * SKU reference id. May be an array of objects with possibly `null` value properties.
   *
   * @type {Array<{ value: string | null | undefined }> | null | undefined}
   * @memberof MinimalSKU
   */
  referenceId: Array<{ value: string | null | undefined }> | null | undefined
  /**
   * SKU name. Doesn't include the product name.
   *
   * @type {string}
   * @memberof MinimalSKU
   */
  name: string
}

export interface MinimalProduct {
  /**
   * Product id.
   *
   * @type {string}
   * @memberof MinimalProduct
   */
  id: string
  /**
   * Product name. Doesn't include the SKU name.
   *
   * @type {string}
   * @memberof MinimalProduct
   */
  productName: string
  /**
   * Product brand.
   *
   * @type {string}
   * @memberof MinimalProduct
   */
  brand: string
  /**
   * Product's category tree. Each category must have a name.
   *
   * @type {Array<{ name: string }>}
   * @memberof MinimalProduct
   */
  categoryTree: Array<{ name: string }>
  /**
   * Product reference id.
   *
   * @type {string | null | undefined}
   * @memberof MinimalProduct
   */
  productReference: string | null | undefined
  /**
   * Product's SKU list.
   *
   * @type {MinimalSKU[]}
   * @memberof MinimalProduct
   */
  items: MinimalSKU[]
}

export type PageType = 'fullTextSearch' | 'nonFullTextSearch' | 'other'
