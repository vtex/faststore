import { useCallback } from 'react'
import { SkuOption } from './SkuSelector'

function getSkuSlug(
  slugsMap: Record<string, string>,
  selectedVariations: Record<string, string>,
  dominantVariation: string
) {
  const slugsMapKey = Object.entries(selectedVariations).flat().join('-')

  if (slugsMapKey in slugsMap) {
    return slugsMap[slugsMapKey]
  }

  const possibleVariants = Object.keys(slugsMap)

  const firstVariationForDominantValue = possibleVariants.find((slug) =>
    slug.includes(
      `${dominantVariation}-${selectedVariations[dominantVariation]}`
    )
  )

  return slugsMap[firstVariationForDominantValue ?? possibleVariants[0]]
}

export const useSkuSlug = (
  activeVariations: Record<string, string>,
  slugsMap: Record<string, string>,
  skuPropertyName: string,
  getItemHrefProp?: (option: SkuOption) => string
) => {
  const getItemHref = useCallback(
    (option: SkuOption) => {
      if(getItemHrefProp) return { getItemHrefProp }

      const currentItemHref = `/${getSkuSlug(
        slugsMap,
        {
          ...activeVariations,
          [skuPropertyName]: option.value,
        },
        skuPropertyName
      )}/p`
      return currentItemHref
    },
    [activeVariations, getItemHrefProp, slugsMap, skuPropertyName]
  )
  return { getItemHref }
}
