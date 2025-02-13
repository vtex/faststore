import React, { forwardRef, type HTMLAttributes } from 'react'
import Rating from '../../molecules/Rating'
import ProgressStatus from '../../molecules/ProgressStatus'
import Icon from '../../atoms/Icon'
import Button from '../../atoms/Button'

export interface RatingSummaryProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The average rating of the product
   */
  average: number
  /**
   * The total number of reviews of the product
   */
  totalCount: number
  /**
   * The distribution of the ratings
   */
  distribution: {
    starsOne: number
    starsTwo: number
    starsThree: number
    starsFour: number
    starsFive: number
  }
  /**
   * The total count text to be displayed after the total count number
   * @default 'Reviews'
   */
  totalCountText?: string
  /**
   * The text to be displayed when there are no reviews
   * @default 'No reviews yet'
   */
  zeroCountText?: string
  /**
   * The text to be displayed on the button for writing a new review
   * @default 'Write a review'
   */
  buttonText?: string
  /**
   * The text to be displayed on the button for writing the very first review
   * @default 'Write the first review'
   */
  buttonTextFirstReview?: string
  /**
   * Optional test ID for testing.
   */
  testId?: string
}

function buildProgressStatus(key: number, value: number) {
  return (
    <ProgressStatus
      data-fs-rating-summary-distribution-status
      leftSideElement={
        <span data-fs-rating-summary-distribution-key>
          <p>{key}</p>
          <Icon data-fs-rating-summary-distribution-key-star name="Star" />
        </span>
      }
      progressValue={value}
      rightSideElement={
        <p data-fs-rating-summary-distribution-value>{value}%</p>
      }
    />
  )
}

export const RatingSummary = forwardRef<HTMLDivElement, RatingSummaryProps>(
  function RatingSummary(
    {
      average,
      totalCount,
      distribution,
      testId = 'fs-rating-summary',
      totalCountText = 'Reviews',
      zeroCountText = 'No reviews yet',
      buttonText = 'Write a review',
      buttonTextFirstReview = 'Write the first review',
      ...props
    },
    ref
  ) {
    const finalTotalCountText =
      totalCount > 0 ? `${totalCount} ${totalCountText}` : zeroCountText
    const finalButtonText = totalCount > 0 ? buttonText : buttonTextFirstReview
    const formattedAverage = average > 0 ? average.toPrecision(2) : ''

    return (
      <div ref={ref} data-fs-rating-summary data-testid={testId} {...props}>
        <div data-fs-rating-summary-header>
          <h2 data-fs-rating-summary-header-average>{formattedAverage}</h2>
          <Rating data-fs-rating-summary-header-stars value={average} />
          <p data-fs-rating-summary-header-total-count>{finalTotalCountText}</p>
        </div>
        <div>
          <Button
            data-fs-rating-summary-button
            variant="secondary"
            onClick={() => alert('Write a review button clicked!')}
          >
            {finalButtonText}
          </Button>
        </div>
        {totalCount > 0 && (
          <div data-fs-rating-summary-distribution>
            {buildProgressStatus(5, distribution.starsFive)}
            {buildProgressStatus(4, distribution.starsFour)}
            {buildProgressStatus(3, distribution.starsThree)}
            {buildProgressStatus(2, distribution.starsTwo)}
            {buildProgressStatus(1, distribution.starsOne)}
          </div>
        )}
      </div>
    )
  }
)

export default RatingSummary
