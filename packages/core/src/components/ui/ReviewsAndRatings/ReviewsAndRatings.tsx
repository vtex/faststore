import { RatingSummary } from '@faststore/ui'
import { usePDP } from 'src/sdk/overrides/PageProvider'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import { type RatingSummaryProps, useUI } from '@faststore/components'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

export type ReviewsAndRatingsProps = {
  title: string
  ratingSummary: {
    ratingCounter: RatingSummaryProps['textLabels']['ratingCounter']
    createReviewButton: RatingSummaryProps['textLabels']['createReviewButton']
  }
  addReviewModal: {
    title: string
    closeButtonAriaLabel: string
    cancelButtonLabel: string
    submitButtonLabel: string
  }
}

function ReviewsAndRatings({
  title,
  ratingSummary,
  addReviewModal,
}: ReviewsAndRatingsProps) {
  const { RatingSummary, __experimentalAddReviewModal: AddReviewModal } =
    useOverrideComponents<'ReviewsAndRatings'>()
  const context = usePDP()
  const { openAddReviewModal, addReviewModal: displayAddReviewModal } = useUI()
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
              onCreateReviewClick={openAddReviewModal}
            />
          )}
        </div>

        {displayAddReviewModal && (
          <AddReviewModal.Component
            {...AddReviewModal.props}
            {...addReviewModal}
          />
        )}
      </>
    )
  )
}

export default ReviewsAndRatings
