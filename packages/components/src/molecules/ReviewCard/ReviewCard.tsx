import React, { forwardRef, useEffect, useRef, useState } from 'react'
import type { HTMLAttributes } from 'react'
import Rating from '../Rating'
import Link from '../../atoms/Link'
import ReviewAuthor from './ReviewAuthor'
import ReviewDate from './ReviewDate'

export interface ReviewCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The headline of the review.
   */
  reviewHeadline: string
  /**
   * The text of the review.
   */
  reviewText: string
  /**
   * The rating of the review.
   */
  reviewRating: number
  /**
   * The author of the review.
   */
  author?: string
  /**
   * Whether the author is verified or not. Defaults to false.
   */
  isVerified?: boolean
  /**
   * Text to be displayed in the tooltip when hovering over the verified icon. Defaults to 'Verified User'.
   */
  verifiedText?: string
  /**
   * The date of the review.
   */
  reviewDate?: Date
  /**
   * Optional locale to format the date. Defaults to 'en-US'.
   */
  locale?: string
  /**
   * Text to be displayed in the read more button. Defaults to 'Read More'.
   */
  readMoreText?: string
  /**
   * Text to be displayed in the read less button. Defaults to 'Read Less'.
   */
  readLessText?: string
}

const ReviewCard = forwardRef<HTMLDivElement, ReviewCardProps>(
  function ReviewCard(
    {
      reviewHeadline,
      reviewText,
      reviewRating,
      author,
      isVerified,
      verifiedText = 'Verified User',
      reviewDate,
      locale = 'en-US',
      readMoreText = 'Read More',
      readLessText = 'Read Less',
      testId = 'fs-review-card',
      ...otherProps
    },
    ref
  ) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isClamped, setIsClamped] = useState(false)
    const textContentRef = useRef<HTMLParagraphElement | null>(null)

    useEffect(() => {
      if (textContentRef.current) {
        const { scrollHeight, clientHeight } = textContentRef.current
        setIsClamped(scrollHeight > clientHeight)
      }
    }, [reviewText, isExpanded])

    const toggleExpanded = () => {
      setIsExpanded(!isExpanded)
    }

    return (
      <div data-testid={testId} ref={ref} data-fs-review-card {...otherProps}>
        <div data-fs-review-card-header>
          <Rating value={reviewRating} />
          {author && (
            <ReviewAuthor
              data-fs-review-card-author="desktop"
              author={author}
              isVerified={Boolean(isVerified)}
              verifiedText={verifiedText}
            />
          )}
          {reviewDate && (
            <ReviewDate data-fs-review-card-date="mobile" date={reviewDate} />
          )}
        </div>
        <div data-fs-review-card-text>
          <div data-fs-review-card-text-header>
            <h3 data-fs-review-card-text-headline>{reviewHeadline}</h3>

            {reviewDate && (
              <ReviewDate
                data-fs-review-card-date="desktop"
                date={reviewDate}
              />
            )}
          </div>
          <p
            ref={textContentRef}
            data-fs-review-card-text-content={
              isExpanded ? 'expanded' : 'collapsed'
            }
          >
            {reviewText}
          </p>
          {(isClamped || isExpanded) && (
            <Link
              data-fs-review-card-text-read-more
              onClick={toggleExpanded}
              size="small"
              as="button"
            >
              {isExpanded ? readLessText : readMoreText}
            </Link>
          )}
        </div>
        {author && (
          <ReviewAuthor
            data-fs-review-card-author="mobile"
            author={author}
            isVerified={Boolean(isVerified)}
          />
        )}
      </div>
    )
  }
)

export default ReviewCard
