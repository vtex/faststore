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
  /**
   * The string label to display when the date is today.
   */
  todayLabel: string
}

const ReviewCardDate = forwardRef<HTMLDivElement, ReviewCardDateProps>(
  function ReviewCardDate(
    { date, locale = 'en-US', todayLabel = 'Today', ...otherProps },
    ref
  ) {
    const todayString = formatDate(new Date(), locale)
    const dateString = formatDate(date, locale)

    return (
      <span data-fs-review-card-date {...otherProps} ref={ref}>
        {dateString === todayString ? todayLabel : dateString}
      </span>
    )
  }
)

export default ReviewCardDate
