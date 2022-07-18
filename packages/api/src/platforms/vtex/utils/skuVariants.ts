import { StoreProduct as StoreProductType } from '../../..'
import type { Product, Item } from '../clients/search/types/ProductSearchResult'

export type SkuVariants = StoreProductType[]

export type SkuVariantsByName = Record<
  string,
  Array<{ alt: string; src: string; label: string; value: string }>
>

function findSkuVariantImage(availableImages: Item['images']) {
  return (
    availableImages.find(
      (imageProperties) => imageProperties.imageLabel === 'skuvariation'
    ) ?? availableImages[0]
  )
}

export function createSlugsMap(
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

export function getActiveSkuVariations(variations: Item['variations']) {
  const activeVariations: Record<string, string> = {}

  variations.forEach((variation) => {
    activeVariations[variation.name] = variation.values[0]
  })

  return activeVariations
}

export function getVariantsByName(
  skuSpecifications: Product['skuSpecifications']
) {
  const variants: Record<string, string[]> = {}

  skuSpecifications?.forEach((specification) => {
    variants[specification.field.originalName ?? specification.field.name] =
      specification.values.map((value) => value.originalName ?? value.name)
  })

  return variants
}

export function getFormattedVariations(
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
