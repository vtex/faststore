import React, { forwardRef, type HTMLAttributes } from 'react'
import RatingDistributionItem from './RatingDistributionItem'

export interface RatingDistributionProps
  extends HTMLAttributes<HTMLOListElement> {
  /**
   * The rating distribution
   */
  distribution: {
    starsOne: number
    starsTwo: number
    starsThree: number
    starsFour: number
    starsFive: number
  }
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

export const RatingDistribution = forwardRef<
  HTMLOListElement,
  RatingDistributionProps
>(function RatingDistribution(
  {
    distribution: { starsFive, starsFour, starsThree, starsTwo, starsOne },
    testId = 'fs-rating-distribution',
    ...props
  },
  ref
) {
  return (
    <ol ref={ref} data-fs-rating-distribution data-testid={testId} {...props}>
      <RatingDistributionItem ratingIndex={5} value={starsFive} />
      <RatingDistributionItem ratingIndex={4} value={starsFour} />
      <RatingDistributionItem ratingIndex={3} value={starsThree} />
      <RatingDistributionItem ratingIndex={2} value={starsTwo} />
      <RatingDistributionItem ratingIndex={1} value={starsOne} />
    </ol>
  )
})

export default RatingDistribution
