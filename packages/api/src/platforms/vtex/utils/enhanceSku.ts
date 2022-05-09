import type { Product, Item } from '../clients/search/types/ProductSearchResult'

export type EnhancedSku = Item & { isVariantOf: Product }

export const enhanceSku = (item: Item, product: Product): EnhancedSku => ({
  ...item,
  isVariantOf: product,
})
