import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { StoreProduct } from './product'
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

export const SkuVariants: Record<string, Resolver<Root>> = {
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
      return null
    }

    const filteredFormattedVariations = getFormattedVariations(
      root.isVariantOf.items,
      dominantVariantName,
      activeDominantVariationValue
    )

    return filteredFormattedVariations
  },
}
