import { RatingSummary } from '@faststore/ui'
import { usePDP } from 'src/sdk/overrides/PageProvider'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import { type RatingSummaryProps, useUI } from '@faststore/components'
import type { AddReviewModalProps } from 'src/components/reviews/AddReviewModal/AddReviewModal'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

export type ReviewsAndRatingsProps = {
  title: string
  ratingSummary: {
    ratingCounter: RatingSummaryProps['textLabels']['ratingCounter']
    createReviewButton: RatingSummaryProps['textLabels']['createReviewButton']
  }
  addReviewModal: Omit<AddReviewModalProps, 'product'>
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
              onCreateReviewClick={openAddReviewModal}
            />
          )}
        </div>

        {displayAddReviewModal && !isValidating && (
          <AddReviewModal.Component
            {...addReviewModal}
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
