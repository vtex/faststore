import type {
  Product,
  Item,
} from '../clients/apps/search/types/ProductSearchResult'
import { sanitizeHtml } from './sanitizeHtml'

export type ProductRating = {
  average: number
  totalCount: number
  distribution: Record<number, number>
}

export type EnhancedSku = Item & { isVariantOf: Product } & {
  rating: ProductRating
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
    distribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  },
  isVariantOf: sanitizeProduct(product),
})
