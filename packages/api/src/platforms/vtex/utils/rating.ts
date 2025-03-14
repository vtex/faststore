import type { ProductRating as ApiClientProductRating } from '../clients/apps/reviewsAndRatings/types/ProductRating'
import type { ProductRating } from './enhanceSku'

export function buildRatingDistribution({
  average,
  totalCount,
  starsOne,
  starsTwo,
  starsThree,
  starsFour,
  starsFive,
}: ApiClientProductRating): ProductRating {
  const rating: ProductRating = {
    average,
    totalCount,
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

  const integerPercentages = [
    starsOne,
    starsTwo,
    starsThree,
    starsFour,
    starsFive,
  ].map((value) => calculateIntegerPercentage(value, totalCount))

  const totalPercentage = integerPercentages.reduce(
    (acc, curr) => acc + curr,
    0
  )

  if (totalPercentage !== 100) {
    const percentageDifference = 100 - totalPercentage
    adjustPercentageDistributionTo100(integerPercentages, percentageDifference)
  }

  integerPercentages.forEach(
    (percentage, index) => (rating.distribution[index + 1] = percentage)
  )

  return rating
}

/**
 * Calculates the integer percentage of a value relative to a total.
 *
 * @param {number} value - The value to calculate the percentage for.
 * @param {number} total - The total value to calculate the percentage against.
 * @returns {number} - The calculated integer percentage.
 */
function calculateIntegerPercentage(value: number, total: number): number {
  return Math.round((value / total) * 100)
}

/**
 * Adjusts the percentage distribution to ensure the total is 100%.
 *
 * Cases where the total is not 100% are handled by adjusting the highest percentage.
 * When there are multiple highest percentages, the index is chosen based on the percentage difference.
 * If the difference is positive, meaning that the percentage sum is lower than 100%, then the highest index is chosen, otherwise the lowest.
 *
 * @param {number[]} percentages - The array of percentages to adjust.
 * @param {number} percentageDifference - The difference needed to reach 100%.
 */
function adjustPercentageDistributionTo100(
  percentages: number[],
  percentageDifference: number
) {
  const maxPercentage = Math.max(...percentages)
  const highestIndexWithMaxPercentage = percentages.findLastIndex(
    (percent) => percent === maxPercentage
  )
  const lowestIndexWithMaxPercentage = percentages.findIndex(
    (percent) => percent === maxPercentage
  )
  const changingIndex =
    percentageDifference > 0
      ? highestIndexWithMaxPercentage
      : lowestIndexWithMaxPercentage
  percentages[changingIndex] += percentageDifference
}
