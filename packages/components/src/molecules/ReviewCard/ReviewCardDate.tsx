import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { formatDate } from '../../utils/date'

export interface ReviewCardDateProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The date of the review.
   */
  date: Date
  /**
   * Optional locale to format the date. Defaults to 'en-US'.
   */
  locale?: string
}

const ReviewCardDate = forwardRef<HTMLDivElement, ReviewCardDateProps>(
  function ReviewCardDate({ date, locale = 'en-US', ...otherProps }, ref) {
    return (
      <span data-fs-review-card-date {...otherProps} ref={ref}>
        {formatDate(date, locale)}
      </span>
    )
  }
)

export default ReviewCardDate
