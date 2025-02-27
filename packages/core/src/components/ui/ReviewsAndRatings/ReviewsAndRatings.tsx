import { type RatingSummaryProps, useUI } from '@faststore/ui'
import { usePDP } from 'src/sdk/overrides/PageProvider'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import type { ReviewModalProps } from 'src/components/reviews/ReviewModal/ReviewModal'

export type ReviewsAndRatingsProps = {
  title: string
  ratingSummary: {
    ratingCounter: RatingSummaryProps['textLabels']['ratingCounter']
    createReviewButton: RatingSummaryProps['textLabels']['createReviewButton']
  }
  reviewModal: Omit<ReviewModalProps, 'product'>
}

function ReviewsAndRatings({
  title,
  ratingSummary,
  reviewModal,
}: ReviewsAndRatingsProps) {
  const { RatingSummary, __experimentalReviewModal: ReviewModal } =
    useOverrideComponents<'ReviewsAndRatings'>()
  const context = usePDP()
  const { openReviewModal, reviewModal: displayReviewModal } = useUI()
  const { isDesktop } = useScreenResize()
  const { product, isValidating } = context.data

  return (
    product?.rating && (
      <>
        <h2 className="text__title-section layout__content">{title}</h2>
        <div data-fs-content>
          {(isDesktop || product?.rating?.totalCount > 0) && (
            <RatingSummary.Component
              {...RatingSummary.props}
              textLabels={{ ...ratingSummary }}
              // Dynamic props shouldn't be overridable
              // This decision can be reviewed later if needed
              {...product?.rating}
              onCreateReviewClick={openReviewModal}
            />
          )}
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
  )
}

export default ReviewsAndRatings
