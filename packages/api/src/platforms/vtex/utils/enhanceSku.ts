import type { OrderFormItem } from '../clients/commerce/types/OrderForm'
import type { Product, Item } from '../clients/search/types/ProductSearchResult'
import { sanitizeHtml } from './sanitizeHtml'

export type EnhancedSku = Item & { isVariantOf: Product }

function sanitizeProduct(product: Product): Product {
  return {
    ...product,
    description: product.description
      ? sanitizeHtml(product.description)
      : product.description,
  }
}

export const enhanceSku = (item: Item, product: Product): EnhancedSku => ({
  ...item,
  isVariantOf: sanitizeProduct(product),
})

/** `/some-product/p` -> `some-product` */
const linkTextFromDetailUrl = (detailUrl: string) =>
  detailUrl.replace(/^\//, '').replace(/\/p$/, '')

/**
 * SKU built from the cart line Checkout returned, for a SKU Intelligent Search
 * does not return (for example a service SKU hidden from the storefront). It
 * carries only what the orderForm knows: no variations, specifications or
 * offers, so it is for cart lines only.
 */
export const enhanceSkuFromOrderFormItem = (
  item: OrderFormItem
): EnhancedSku => {
  const sku: Item = {
    itemId: item.id,
    // `name` is the line name Checkout shows (product + SKU name). `skuName`
    // alone is often a code, e.g. a service plan's part number.
    name: item.name,
    nameComplete: item.name,
    complementName: '',
    ean: item.ean ?? '',
    referenceId: item.refId ? [{ Key: 'RefId', Value: item.refId }] : [],
    measurementUnit: item.measurementUnit,
    unitMultiplier: item.unitMultiplier,
    modalType: null,
    images: item.imageUrl
      ? [
          {
            imageId: '',
            imageLabel: null,
            imageTag: '',
            imageUrl: item.imageUrl,
            imageText: item.name,
          },
        ]
      : [],
    videos: [],
    variations: [],
    sellers: [],
    attachments: [],
    isKit: false,
    attributes: [],
  }

  const product: Product = {
    productId: item.productId,
    productName: item.name,
    productTitle: item.name,
    brand: item.additionalInfo?.brandName ?? '',
    brandId: Number(item.additionalInfo?.brandId) || 0,
    linkText: linkTextFromDetailUrl(item.detailUrl ?? ''),
    productReference: item.productRefId ?? '',
    categoryId: '',
    clusterHighlights: [],
    productClusters: [],
    categories: [],
    categoriesIds: [],
    link: item.detailUrl ?? '',
    description: '',
    metaTagDescription: '',
    items: [sku],
    skuSpecifications: [],
    priceRange: {
      sellingPrice: { highPrice: null, lowPrice: null },
      listPrice: { highPrice: null, lowPrice: null },
    },
    specificationGroups: [],
    properties: [],
    selectedProperties: [],
    releaseDate: '',
  }

  return enhanceSku(sku, product)
}
