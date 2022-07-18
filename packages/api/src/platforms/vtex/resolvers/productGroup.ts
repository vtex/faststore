import { enhanceSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { StoreProduct } from './product'
import { VALUE_REFERENCES } from '../utils/propertyValue'
import { StoreProduct as StoreProductType } from '../../..'
import { Item } from '../clients/search/types/ProductSearchResult'

type Root = PromiseType<ReturnType<typeof StoreProduct.isVariantOf>>

export type SkuVariants = StoreProductType[]

export type SkuVariantsByName = Record<
  string,
  Array<{ alt: string; src: string; label: string; value: string }>
>

type SlugsMapArgs = {
  dominantVariantName: string
}

const BLOCKED_SPECIFICATIONS = new Set(['allSpecifications'])

function createSlugsMap(
  variants: Item[],
  mainVariant: string,
  baseSlug: string
) {
  /**
   * Maps property value combinations to their respective SKU's slug. Enables
   * us to retrieve the slug for the SKU that matches the currently selected
   * variations in O(1) time.
   *
   * Example: `'Color-Red-Size-40': 'classic-shoes-37'`
   */
  const slugsMap: Record<string, string> = {}

  variants.forEach((variant) => {
    const skuSpecificationProperties = variant.variations

    if (skuSpecificationProperties.length === 0) {
      return
    }

    // Make sure that the 'name-value' pair for the `mainVariant` variation
    // is always the first one.
    let skuVariantKey = `${mainVariant}-${
      skuSpecificationProperties.find(
        (variationDetails) => variationDetails.name === mainVariant
      )?.values[0] ?? ''
    }`

    skuSpecificationProperties.forEach((property) => {
      skuVariantKey +=
        property.name !== mainVariant
          ? `-${property.name}-${property.values[0]}`
          : ''
    })

    slugsMap[skuVariantKey] = `${baseSlug}-${variant.itemId}`
  })

  return slugsMap
}

function getActiveSkuVariations(variations: Root['variations']) {
  const activeVariations: Record<string, string> = {}

  variations.forEach((variation) => {
    activeVariations[variation.name] = variation.values[0]
  })

  return activeVariations
}

function getVariantsByName(root: Root) {
  const { skuSpecifications } = root.isVariantOf
  const variants: Record<string, string[]> = {}

  skuSpecifications?.forEach((specification) => {
    variants[specification.field.originalName ?? specification.field.name] =
      specification.values.map((value) => value.originalName ?? value.name)
  })

  return variants
}

function findSkuVariantImage(availableImages: Item['images']) {
  return (
    availableImages.find(
      (imageProperties) => imageProperties.imageLabel === 'skuvariation'
    ) ?? availableImages[0]
  )
}

function getFormattedVariations(
  variants: Item[],
  dominantVariant: string,
  dominantVariantValue: string
) {
  /**
   * SKU options already formatted and indexed by their property name.
   *
   * Ex: {
   *   `Size`: [
   *     { label: '42', value: '42' },
   *     { label: '41', value: '41' },
   *     { label: '39', value: '39' },
   *   ]
   * }
   */
  const variantsByName: SkuVariantsByName = {}

  // Prevent duplicate entries.
  const previouslySeenPropertyValues: Record<string, number> = {}

  variants.forEach((variant) => {
    if (variant.variations.length === 0) {
      return
    }

    const variantImageToUse = findSkuVariantImage(variant.images)

    const dominantVariantEntry = variant.variations.find(
      (variation) => variation.name === dominantVariant
    )

    const matchesDominantVariant =
      dominantVariantEntry?.values[0] === dominantVariantValue

    if (!matchesDominantVariant) {
      if (
        !dominantVariantEntry ||
        dominantVariantEntry.values[0] in previouslySeenPropertyValues
      ) {
        return
      }

      previouslySeenPropertyValues[dominantVariantEntry.values[0]] = 1

      const formattedVariant = {
        src: variantImageToUse.imageUrl,
        alt: variantImageToUse.imageLabel ?? '',
        label: dominantVariantEntry.values[0],
        value: dominantVariantEntry.values[0],
      }

      if (variantsByName[dominantVariantEntry.name]) {
        variantsByName[dominantVariantEntry.name].push(formattedVariant)
      } else {
        variantsByName[dominantVariantEntry.name] = [formattedVariant]
      }

      return
    }

    variant.variations.forEach((variationProperty) => {
      if (variationProperty.values[0] in previouslySeenPropertyValues) {
        return
      }

      previouslySeenPropertyValues[variationProperty.values[0]] = 1

      const formattedVariant = {
        src: variantImageToUse.imageUrl,
        alt: variantImageToUse.imageLabel ?? '',
        label: variationProperty.values[0],
        value: variationProperty.values[0],
      }

      if (variantsByName[variationProperty.name]) {
        variantsByName[variationProperty.name].push(formattedVariant)
      } else {
        variantsByName[variationProperty.name] = [formattedVariant]
      }
    })
  })

  return variantsByName
}

export const StoreProductGroup: Record<string, Resolver<Root>> = {
  activeVariations: (root) => getActiveSkuVariations(root.variations),
  allVariantsByName: (root) => getVariantsByName(root),

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
