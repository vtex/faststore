import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import Tooltip from '../Tooltip'
import Icon from '../../atoms/Icon'

export interface ReviewAuthorProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The author of the review.
   */
  author: string
  /**
   * Whether the author is verified or not. Defaults to false.
   */
  isVerified: boolean
  /**
   * Text to be displayed in the tooltip when hovering over the verified icon. Defaults to 'Verified User'.
   */
  verifiedText?: string
}

const ReviewAuthor = forwardRef<HTMLDivElement, ReviewAuthorProps>(
  function ReviewAuthor(
    { author, isVerified, verifiedText = 'Verified User', ...otherProps },
    ref
  ) {
    return (
      <div data-fs-review-card-author {...otherProps} ref={ref}>
        <span data-fs-review-card-author-name>{author}</span>
        {isVerified && (
          <Tooltip content={verifiedText}>
            <Icon
              data-fs-review-card-author-verified
              name="CircleWavyCheck"
              width={20}
              height={20}
            />
          </Tooltip>
        )}
      </div>
    )
  }
)

export default ReviewAuthor
