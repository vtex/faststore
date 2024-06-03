import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import { StoreProduct } from './product'
import {
  createSlugsMap,
  getActiveSkuVariations,
  getFormattedVariations,
  getVariantsByName,
} from '../utils/skuVariants'
import { getProductLoader } from '../loaders/product'

export type Root = PromiseType<ReturnType<typeof StoreProduct.isVariantOf>>

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
      (args as SlugsMapArgs).dominantVariantName ?? root.variations[0]?.name,
      root.isVariantOf.linkText
    ),

  availableVariations: (root, args) => {
    console.log("items", JSON.stringify(root, null, "lala"))

    root.isVariantOf.items

    const dominantVariantName = (args as SlugsMapArgs).dominantVariantName ?? root.variations[0]?.name
    const activeVariations = getActiveSkuVariations(root.variations)

    const activeDominantVariationValue = activeVariations[dominantVariantName]

    const filteredFormattedVariations = getFormattedVariations(
      root.isVariantOf.items,
      dominantVariantName,
      activeDominantVariationValue
    )

    return filteredFormattedVariations
  },

  allVariantProducts: (root, args, ctx) => {
    const slugMap = createSlugsMap(
      root.isVariantOf.items,
      (args as SlugsMapArgs).dominantVariantName ?? root.variations[0]?.name,
      root.isVariantOf.linkText
    )

    return Object.values(slugMap).map(slug => getProductLoader([{ key: 'slug', value: slug }], ctx))
  }
}