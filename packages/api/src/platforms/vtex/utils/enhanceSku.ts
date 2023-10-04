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
