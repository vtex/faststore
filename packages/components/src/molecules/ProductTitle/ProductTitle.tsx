import React, { forwardRef, type HTMLAttributes } from 'react'
import type { ReactNode } from 'react'

import { Rating } from '../../'

export interface ProductTitleProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * A react component to be used as the product title, e.g. a `h1`
   */
  title: ReactNode
  /**
   * A react component to be used as the product label, e.g. a `DiscountBadge`
   */
  label?: ReactNode
  /**
   * Label for reference.
   */
  refTag?: string
  /**
   * A text to be used below the title and the label, such as the product's reference number.
   */
  refNumber?: string
  /**
   * Object containing the rating value and reviews count
   */
  reviewsAndRatings?: {
    /**
     * Object containing the rating value and reviews count
     */
    ratingValue?: number
    /**
     * The amount of reviews for the product.
     */
    reviewsCount?: number
    /**
     * Text to display when there aren't reviews.
     * @default "No reviews yet".
     */
    noReviewsText?: string
    /**
     * Text to display when there is only one review.
     * @default "review".
     */
    singleReviewText?: string
    /**
     * Text to display when there are multiple reviews.
     * @default "reviews".
     */
    multipleReviewsText?: string
  }
}

const ProductTitle = forwardRef<HTMLElement, ProductTitleProps>(
  function ProductTitle(
    {
      title,
      label,
      refTag = 'Ref.: ',
      refNumber,
      testId = 'fs-product-title',
      reviewsAndRatings,
      ...otherProps
    },
    ref
  ) {
    const {
      ratingValue,
      reviewsCount,
      noReviewsText = 'No reviews yet',
      singleReviewText = 'review',
      multipleReviewsText = 'reviews',
    } = reviewsAndRatings || {}

    return (
      <header
        ref={ref}
        data-fs-product-title
        data-testid={testId}
        {...otherProps}
      >
        <div data-fs-product-title-header>
          {title}
          {!!label && label}
        </div>

        {(refNumber || ratingValue !== undefined) && (
          <div data-fs-product-title-addendum>
            <div data-fs-product-title-rating>
              {ratingValue !== undefined && <Rating value={ratingValue} />}

              {reviewsCount !== undefined && (
                <a href="#reviews-and-ratings" data-fs-product-title-reviews>
                  {reviewsCount === 0
                    ? noReviewsText
                    : `${reviewsCount} ${
                        reviewsCount === 1
                          ? singleReviewText
                          : multipleReviewsText
                      }`}
                </a>
              )}
            </div>
            {refNumber && (
              <>
                {refTag} {refNumber}
              </>
            )}
          </div>
        )}
      </header>
    )
  }
)

export default ProductTitle
