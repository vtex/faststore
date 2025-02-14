import type { Product, Item } from '../clients/search/types/ProductSearchResult'
import { sanitizeHtml } from './sanitizeHtml'

export type EnhancedSku = Item & { isVariantOf: Product } & {
  rating: { average: number; totalCount: number }
}

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
  rating: {
    average: 0,
    totalCount: 0,
  },
  isVariantOf: sanitizeProduct(product),
})
