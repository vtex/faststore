import { enhanceSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { StoreProduct } from './product'

type Root = PromiseType<ReturnType<typeof StoreProduct.isVariantOf>>

export const StoreProductGroup: Record<string, Resolver<Root>> = {
  hasVariant: (root) =>
    root.isVariantOf.items.map((item) => enhanceSku(item, root.isVariantOf)),
  productGroupID: ({ itemId }) => itemId,
  name: ({ isVariantOf }) => isVariantOf.productName,
  // TODO: Check if textAttribute is another property from search
  additionalProperty: ({ isVariantOf: { skuSpecifications = [] } }) =>
    skuSpecifications,
}
