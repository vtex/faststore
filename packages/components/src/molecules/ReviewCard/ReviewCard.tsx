import React, { forwardRef, useEffect, useRef, useState } from 'react'
import type { HTMLAttributes } from 'react'
import Rating from '../Rating'
import Link from '../../atoms/Link'
import ReviewCardAuthor, {
  type ReviewCardAuthorProps,
} from './ReviewCardAuthor'
import ReviewCardDate, { type ReviewCardDateProps } from './ReviewCardDate'

export interface ReviewCardProps
  extends HTMLAttributes<HTMLDivElement>,
    Partial<ReviewCardAuthorProps>,
    Partial<ReviewCardDateProps> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The title of the review.
   */
  title: string
  /**
   * The text of the review.
   */
  text: string
  /**
   * The rating of the review.
   */
  rating: number
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
      title,
      text,
      rating,
      author,
      date,
      isVerified,
      verifiedText = 'Verified User',
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
    }, [text, isExpanded])

    const toggleExpanded = () => {
      setIsExpanded(previousIsExpanded => !previousIsExpanded)
    }

    return (
      <div data-testid={testId} ref={ref} data-fs-review-card {...otherProps}>
        <div data-fs-review-card-header>
          <Rating value={rating} />
          {author && (
            <ReviewCardAuthor
              data-fs-review-card-author="desktop"
              author={author}
              isVerified={Boolean(isVerified)}
              verifiedText={verifiedText}
            />
          )}
          {date && (
            <ReviewCardDate data-fs-review-card-date="mobile" date={date} />
          )}
        </div>
        <div data-fs-review-card-text>
          <div data-fs-review-card-text-header>
            <h3 data-fs-review-card-text-headline>{title}</h3>

            {date && (
              <ReviewCardDate data-fs-review-card-date="desktop" date={date} />
            )}
          </div>
          <p
            ref={textContentRef}
            data-fs-review-card-text-content={
              isExpanded ? 'expanded' : 'collapsed'
            }
          >
            {text}
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
          <ReviewCardAuthor
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
