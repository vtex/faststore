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
  reviewModal: ReviewModalProps
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

  const rating = context?.data?.product?.rating

  return (
    rating && (
      <>
        <h2 className="text__title-section layout__content">{title}</h2>
        <div data-fs-content>
          {(isDesktop || rating?.totalCount > 0) && (
            <RatingSummary.Component
              {...RatingSummary.props}
              textLabels={{ ...ratingSummary }}
              // Dynamic props shouldn't be overridable
              // This decision can be reviewed later if needed
              {...rating}
              onCreateReviewClick={openReviewModal}
            />
          )}
        </div>
        {displayReviewModal && (
          <ReviewModal.Component {...ReviewModal.props} {...reviewModal} />
        )}
      </>
    )
  )
}

export default ReviewsAndRatings
