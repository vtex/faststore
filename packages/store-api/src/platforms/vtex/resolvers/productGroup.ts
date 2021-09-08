import { enhanceSku } from '../utils/enhanceSku'
import type { Product } from '../clients/is/types/ProductSearchResult'
import type { Resolver } from '..'

export const StoreProductGroup: Record<string, Resolver<Product>> = {
  hasVariant: (root) => root.skus.map((sku) => enhanceSku(sku, root)),
  productGroupID: ({ product }) => product,
  name: ({ name }) => name,
}
