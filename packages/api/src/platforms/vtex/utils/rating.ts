import type { ProductRating as ApiClientProductRating } from '../clients/commerce/types/ProductRating'
import type { ProductRating } from './enhanceSku'

export function buildRatingDistribution(
  apiClientRating: ApiClientProductRating
): ProductRating {
  const rating: ProductRating = {
    average: apiClientRating.average,
    totalCount: apiClientRating.totalCount,
    distribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  }

  if (rating.totalCount === 0) {
    return rating
  }

  const percentages = [
    calculateIntegerPercentage(apiClientRating.starsOne, rating.totalCount),
    calculateIntegerPercentage(apiClientRating.starsTwo, rating.totalCount),
    calculateIntegerPercentage(apiClientRating.starsThree, rating.totalCount),
    calculateIntegerPercentage(apiClientRating.starsFour, rating.totalCount),
    calculateIntegerPercentage(apiClientRating.starsFive, rating.totalCount),
  ]

  const totalPercentage = percentages.reduce((acc, curr) => acc + curr, 0)

  if (totalPercentage !== 100) {
    const missingPercentage = 100 - totalPercentage
    const [maxValue, matchedIndexes] = findMaxInArray(percentages)

    const changingIndex =
      missingPercentage > 0
        ? Math.max(...matchedIndexes)
        : Math.min(...matchedIndexes)

    percentages[changingIndex] = maxValue + missingPercentage
  }

  percentages.forEach(
    (percentage, index) => (rating.distribution[index + 1] = percentage)
  )

  return rating
}

function calculateIntegerPercentage(value: number, total: number): number {
  return Math.round((value / total) * 100)
}

function findMaxInArray(arr: number[]): [number, number[]] {
  const maxValue = Math.max(...arr)
  const matchedIndexes = arr.reduce((acc: number[], curr, index) => {
    if (curr === maxValue) {
      acc.push(index)
    }
    return acc
  }, [])

  return [maxValue, matchedIndexes]
}
