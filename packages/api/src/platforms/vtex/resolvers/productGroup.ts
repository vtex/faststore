import type { Resolver } from '..'
import { enhanceSku } from '../utils/enhanceSku'
import { VALUE_REFERENCES } from '../utils/propertyValue'
import type { StoreProduct } from './product'

export type Root = PromiseType<ReturnType<typeof StoreProduct.isVariantOf>>

const BLOCKED_SPECIFICATIONS = new Set(['allSpecifications'])

export const StoreProductGroup: Record<string, Resolver<Root>> = {
  hasVariant: (root) =>
    root.isVariantOf.items.map((item: Parameters<typeof enhanceSku>[0]) =>
      enhanceSku(item, root.isVariantOf)
    ),
  productGroupID: ({ isVariantOf }) => isVariantOf.productId,
  name: (root) => root.isVariantOf.productName,
  skuVariants: (root) => root,
  additionalProperty: ({ isVariantOf: { specificationGroups } }) =>
    specificationGroups
      // Filter sku specifications so we don't mix them with product specs.
      .filter(
        (specificationGroup: { name: string }) =>
          !BLOCKED_SPECIFICATIONS.has(specificationGroup.name)
      )
      // Transform specs back into product specs.
      .flatMap(({ specifications }: any) =>
        specifications.flatMap(({ name, values }: any) =>
          values.map((value: any) => ({
            name,
            value,
            valueReference: VALUE_REFERENCES.specification,
          }))
        )
      ),
}
