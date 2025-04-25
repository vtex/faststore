import { type RatingSummaryProps, useUI } from '@faststore/ui'
import { usePDP } from 'src/sdk/overrides/PageProvider'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import type { ReviewModalProps } from 'src/components/reviews/ReviewModal/ReviewModal'
import type { ReviewListProps } from 'src/components/reviews/ReviewList'

export type ReviewsAndRatingsProps = {
  title: string
  ratingSummary: {
    ratingCounter: RatingSummaryProps['textLabels']['ratingCounter']
    createReviewButton: RatingSummaryProps['textLabels']['createReviewButton']
  }
  reviewModal: Omit<ReviewModalProps, 'product'>
  reviewList: {
    sortSelect: ReviewListProps['sortSelect']
    filterSelect: ReviewListProps['filterSelect']
    emptyFilter: ReviewListProps['emptyFilter']
    emptyList: ReviewListProps['emptyList']
  }
}

function ReviewsAndRatings({
  title,
  ratingSummary,
  reviewModal,
  reviewList,
}: ReviewsAndRatingsProps) {
  const {
    RatingSummary,
    __experimentalRatingSummarySkeleton: RatingSummarySkeleton,
    __experimentalReviewModal: ReviewModal,
    __experimentalReviewList: ReviewList,
  } = useOverrideComponents<'ReviewsAndRatings'>()
  const context = usePDP()
  const { openReviewModal, reviewModal: displayReviewModal } = useUI()
  const { isDesktop } = useScreenResize()
  const { product, isValidating } = context.data

  const rating = product?.aggregateRating

  return (
    <>
      <h2 className="text__title-section layout__content">{title}</h2>
      <div data-fs-content="review-and-ratings">
        {isValidating ? (
          <RatingSummarySkeleton.Component />
        ) : (
          rating &&
          (isDesktop || rating?.reviewCount > 0) && (
            <RatingSummary.Component
              {...RatingSummary.props}
              textLabels={{ ...ratingSummary }}
              // Dynamic props shouldn't be overridable
              // This decision can be reviewed later if needed
              {...rating}
              onCreateReviewClick={openReviewModal}
            />
          )
        )}

        <ReviewList.Component
          {...ReviewList.props}
          {...reviewList}
          // Dynamic props shouldn't be overridable
          // This decision can be reviewed later if needed
          productId={product.id}
        />
      </div>

      {displayReviewModal && !isValidating && (
        <ReviewModal.Component
          {...ReviewModal.props}
          {...reviewModal}
          // Dynamic props shouldn't be overridable
          // This decision can be reviewed later if needed
          product={{
            id: product.id,
            name: product.name,
            image: product.image[0],
          }}
        />
      )}
    </>
  )
}

export default ReviewsAndRatings
