import { enhanceSku } from '../utils/enhanceSku'
import type { Product } from '../clients/search/types/ProductSearchResult'
import type { Resolver } from '..'

export const StoreProductGroup: Record<string, Resolver<Product>> = {
  hasVariant: (root) => root.skus.map((sku) => enhanceSku(sku, root)),
  productGroupID: ({ product }) => product,
  name: ({ name }) => name,
  additionalProperty: (root) => {
    const { textAttributes = [], productSpecifications } = root

    // Product specifications
    const specs = new Set(productSpecifications)

    return textAttributes
      .filter((attribute) => specs.has(attribute.labelKey))
      .map((attribute) => ({
        name: attribute.labelKey,
        value: attribute.labelValue,
      }))
  },
}
