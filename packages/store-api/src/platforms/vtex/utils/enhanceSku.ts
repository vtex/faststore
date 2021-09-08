import type { Product, Skus } from '../clients/is/types/ProductSearchResult'

export type EnhancedSku = Skus & { isVariantOf: Product }

export const enhanceSku = (sku: Skus, product: Product): EnhancedSku => ({
  ...sku,
  isVariantOf: product,
})
