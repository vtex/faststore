import React, { forwardRef, type HTMLAttributes } from 'react'
import Rating from '../../molecules/Rating'
import Button from '../../atoms/Button'
import RatingDistribution from './RatingDistribution'

export interface RatingSummaryProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The average rating of the product. A decimal number between 0 and 5.
   */
  average: number
  /**
   * The total number of reviews of the product. An integer number.
   */
  totalCount: number
  /**
   * The distribution percentage of the ratings
   */
  distribution: {
    starsOne: number
    starsTwo: number
    starsThree: number
    starsFour: number
    starsFive: number
  }
  /**
   * Text labels for the rating counter and create review button
   */
  textLabels?: {
    ratingCounter?: {
      noReviewsText?: string
      singleReviewText?: string
      multipleReviewsText?: string
    }
    createReviewButton?: {
      noReviewsText?: string
      defaultText?: string
    }
  }
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const RatingSummaryHeader = ({
  average,
  totalCount,
  noReviewsText,
  singleReviewText,
  multipleReviewsText,
}: {
  average: number
  totalCount: number
  noReviewsText: string
  singleReviewText: string
  multipleReviewsText: string
}) => {
  const formattedAverage = average > 0 ? average.toPrecision(2) : ''
  const totalCountText =
    totalCount > 0
      ? `${totalCount} ${totalCount === 1 ? singleReviewText : multipleReviewsText}`
      : noReviewsText

  return (
    <div data-fs-rating-summary-header>
      <h2 data-fs-rating-summary-header-average>{formattedAverage}</h2>
      <Rating value={average} />
      <p data-fs-rating-summary-header-total-count>{totalCountText}</p>
    </div>
  )
}

export const RatingSummary = forwardRef<HTMLDivElement, RatingSummaryProps>(
  function RatingSummary(
    {
      average,
      totalCount,
      distribution,
      textLabels: {
        ratingCounter: {
          noReviewsText: ratingCounterNoReviewsText = 'No reviews yet',
          singleReviewText: ratingCounterSingleReviewText = 'Review',
          multipleReviewsText: ratingCounterMultipleReviewsText = 'Reviews',
        } = {},
        createReviewButton: {
          noReviewsText:
            createReviewButtonNoReviewsText = 'Write the first review',
          defaultText: createReviewButtonDefaultText = 'Write a review',
        } = {},
      } = {},
      testId = 'fs-rating-summary',
      ...props
    },
    ref
  ) {
    const buttonText =
      totalCount > 0
        ? createReviewButtonDefaultText
        : createReviewButtonNoReviewsText

    return (
      <div ref={ref} data-fs-rating-summary data-testid={testId} {...props}>
        <RatingSummaryHeader
          average={average}
          totalCount={totalCount}
          noReviewsText={ratingCounterNoReviewsText}
          singleReviewText={ratingCounterSingleReviewText}
          multipleReviewsText={ratingCounterMultipleReviewsText}
        />
        <Button
          variant="secondary"
          onClick={() => alert('Write a review button clicked!')}
        >
          {buttonText}
        </Button>
        {totalCount > 0 && <RatingDistribution distribution={distribution} />}
      </div>
    )
  }
)

export default RatingSummary
