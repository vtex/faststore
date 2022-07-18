import { enhanceSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { StoreProduct } from './product'
import { VALUE_REFERENCES } from '../utils/propertyValue'
import {
  createSlugsMap,
  getActiveSkuVariations,
  getFormattedVariations,
  getVariantsByName,
} from '../utils/skuVariants'

type Root = PromiseType<ReturnType<typeof StoreProduct.isVariantOf>>

type SlugsMapArgs = {
  dominantVariantName: string
}

const BLOCKED_SPECIFICATIONS = new Set(['allSpecifications'])

export const StoreProductGroup: Record<string, Resolver<Root>> = {
  activeVariations: (root) => getActiveSkuVariations(root.variations),
  allVariantsByName: (root) =>
    getVariantsByName(root.isVariantOf.skuSpecifications),

  slugsMap: (root, args) =>
    createSlugsMap(
      root.isVariantOf.items,
      // Since `dominantVariantProperty` is a required argument, we can safely
      // access it.
      (args as SlugsMapArgs).dominantVariantName,
      root.isVariantOf.linkText
    ),

  availableVariations: (root, args) => {
    // Since `dominantVariantProperty` is a required argument, we can safely
    // access it.
    const dominantVariantName = (args as SlugsMapArgs).dominantVariantName
    const activeVariations = getActiveSkuVariations(root.variations)

    const activeDominantVariationValue = activeVariations[dominantVariantName]

    if (!activeDominantVariationValue) {
      throw new Error(
        'SKU does not have a value set for its dominant variation property.'
      )
    }

    const filteredFormattedVariations = getFormattedVariations(
      root.isVariantOf.items,
      dominantVariantName,
      activeDominantVariationValue
    )

    return filteredFormattedVariations
  },

  hasVariant: (root) =>
    root.isVariantOf.items.map((item) => enhanceSku(item, root.isVariantOf)),
  productGroupID: ({ isVariantOf }) => isVariantOf.productId,
  name: (root) => root.isVariantOf.productName,
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
