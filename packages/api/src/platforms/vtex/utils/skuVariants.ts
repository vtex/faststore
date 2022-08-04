import { StoreProduct as StoreProductType } from '../../..'
import type { Product, Item } from '../clients/search/types/ProductSearchResult'

export type SkuVariants = StoreProductType[]

export type SkuVariantsByName = Record<string, Array<FormattedSkuVariant>>

type FormattedSkuVariant = {
  alt: string
  src: string
  label: string
  value: string
}

function findSkuVariantImage(availableImages: Item['images']) {
  return (
    availableImages.find(
      (imageProperties) => imageProperties.imageLabel === 'skuvariation'
    ) ?? availableImages[0]
  )
}

export function createSlugsMap(
  variants: Item[],
  dominantVariantName: string,
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

    // Make sure that the 'name-value' pair for the dominant variation
    // is always the first one.
    const dominantNameValue = `${dominantVariantName}-${
      skuSpecificationProperties.find(
        (variationDetails) => variationDetails.name === dominantVariantName
      )?.values[0] ?? ''
    }`

    const skuVariantKey = skuSpecificationProperties.reduce((acc, property) => {
      const shouldIgnore = property.name === dominantVariantName

      if (shouldIgnore) {
        return acc
      }

      return acc + `-${property.name}-${property.values[0]}`
    }, dominantNameValue)

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

function compare(a: string, b: string) {
  // Values are always represented as Strings, so we need to handle numbers
  // in this special case.
  if (!Number.isNaN(Number(a) - Number(b))) {
    return Number(a) - Number(b)
  }

  if (a < b) {
    return -1
  }

  if (a > b) {
    return 1
  }

  return 0
}

function sortVariants(variantsByName: SkuVariantsByName) {
  const sortedVariants = variantsByName

  for (const variantProperty in variantsByName) {
    variantsByName[variantProperty].sort((a, b) => compare(a.value, b.value))
  }

  return sortedVariants
}

export function getFormattedVariations(
  variants: Item[],
  dominantVariantName: string,
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

  const previouslySeenPropertyValues = new Set<string>()

  variants.forEach((variant) => {
    if (variant.variations.length === 0) {
      return
    }

    const variantImageToUse = findSkuVariantImage(variant.images)

    const dominantVariantEntry = variant.variations.find(
      (variation) => variation.name === dominantVariantName
    )

    const matchesDominantVariant =
      dominantVariantEntry?.values[0] === dominantVariantValue

    if (!matchesDominantVariant) {
      const nameValueIdentifier = `${dominantVariantName}-${dominantVariantEntry?.values[0]}`

      if (
        !dominantVariantEntry ||
        previouslySeenPropertyValues.has(nameValueIdentifier)
      ) {
        return
      }

      previouslySeenPropertyValues.add(nameValueIdentifier)

      const formattedVariant = {
        src: variantImageToUse.imageUrl,
        alt: variantImageToUse.imageLabel ?? '',
        label: `${dominantVariantName}: ${dominantVariantEntry.values[0]}`,
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
      const nameValueIdentifier = `${variationProperty.name}-${variationProperty.values[0]}`

      if (previouslySeenPropertyValues.has(nameValueIdentifier)) {
        return
      }

      previouslySeenPropertyValues.add(nameValueIdentifier)

      const formattedVariant = {
        src: variantImageToUse.imageUrl,
        alt: variantImageToUse.imageLabel ?? '',
        label: `${variationProperty.name}: ${variationProperty.values[0]}`,
        value: variationProperty.values[0],
      }

      if (variantsByName[variationProperty.name]) {
        variantsByName[variationProperty.name].push(formattedVariant)
      } else {
        variantsByName[variationProperty.name] = [formattedVariant]
      }
    })
  })

  return sortVariants(variantsByName)
}
