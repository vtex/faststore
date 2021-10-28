import type { Product, Sku } from '../clients/search/types/ProductSearchResult'

export type EnhancedSku = Sku & { isVariantOf: Product }

export const enhanceSku = (sku: Sku, product: Product): EnhancedSku => ({
  ...sku,
  isVariantOf: product,
})
