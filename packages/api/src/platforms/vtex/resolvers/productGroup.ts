import { enhanceSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { StoreProduct } from './product'

type Root = PromiseType<ReturnType<typeof StoreProduct.isVariantOf>>

const BLOCKED_PROPERTIES: Record<string, boolean> = {
  sellerId: true,
}

export const StoreProductGroup: Record<string, Resolver<Root>> = {
  hasVariant: (root) =>
    root.isVariantOf.items.map((item) => enhanceSku(item, root.isVariantOf)),
  productGroupID: ({ isVariantOf }) => isVariantOf.productId,
  name: ({ isVariantOf }) => isVariantOf.productName,
  additionalProperty: ({ isVariantOf: { properties } }) =>
    properties.flatMap((property) => {
      if (BLOCKED_PROPERTIES[property.name]) {
        return []
      }

      return property.values.map((propertyValue) => ({
        name: property.name,
        value: propertyValue,
      }))
    }),
}
