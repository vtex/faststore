import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { formatDateReviewCard } from '../../utils/date'

export interface ReviewDateProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The date of the review.
   */
  date: Date
  /**
   * Optional locale to format the date. Defaults to 'en-US'.
   */
  locale?: string
}

const ReviewDate = forwardRef<HTMLDivElement, ReviewDateProps>(
  function ReviewDate({ date, locale = 'en-US', ...otherProps }, ref) {
    return (
      <span data-fs-review-card-date {...otherProps} ref={ref}>
        {formatDateReviewCard(date, locale)}
      </span>
    )
  }
)

export default ReviewDate
