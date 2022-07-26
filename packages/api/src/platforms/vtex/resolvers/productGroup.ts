import { enhanceSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { StoreProduct } from './product'
import { VALUE_REFERENCES } from '../utils/propertyValue'

type Root = PromiseType<ReturnType<typeof StoreProduct.isVariantOf>>

const BLOCKED_SPECIFICATIONS = new Set(['allSpecifications'])

export const StoreProductGroup: Record<string, Resolver<Root>> = {
  hasVariant: (root) =>
    root.isVariantOf.items.map((item) => enhanceSku(item, root.isVariantOf)),
  productGroupID: ({ isVariantOf }) => isVariantOf.productId,
  name: (root) => root.isVariantOf.productName,
  skuVariants: (root) => root,
  additionalProperty: ({ isVariantOf: { specificationGroups } }) =>
    specificationGroups
      // Filter sku specifications so we don't mix them with product specs.
      .filter(
        (specificationGroup) =>
          !BLOCKED_SPECIFICATIONS.has(specificationGroup.name)
      )
      // Transform specs back into product specs.
      .flatMap(({ specifications }) =>
        specifications.flatMap(({ name, values }) =>
          values.map((value) => ({
            name,
            value,
            valueReference: VALUE_REFERENCES.specification,
          }))
        )
      ),
}
