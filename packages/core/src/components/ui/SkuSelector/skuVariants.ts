export function getSkuSlug(
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
