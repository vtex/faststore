import { useUI } from '@faststore/components'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

export type ReviewsAndRatingsProps = {
  title: string
  addReviewModal: {
    title: string
    closeButtonAriaLabel: string
    cancelButtonLabel: string
    submitButtonLabel: string
  }
}

function ReviewsAndRatings({ title, addReviewModal }: ReviewsAndRatingsProps) {
  const { AddReviewModalButton, __experimentalAddReviewModal: AddReviewModal } =
    useOverrideComponents<'ReviewsAndRatings'>()
  const { openAddReviewModal, addReviewModal: displayAddReviewModal } = useUI()

  return (
    <>
      <h2 className="text__title-section layout__content">{title}</h2>

      <AddReviewModalButton.Component
        variant="secondary"
        {...AddReviewModalButton.props}
        // Dynamic props shouldn't be overridable
        // This decision can be reviewed later if needed
        onClick={openAddReviewModal}
      >
        Add a review
      </AddReviewModalButton.Component>

      {displayAddReviewModal && (
        <AddReviewModal.Component {...addReviewModal} />
      )}
    </>
  )
}

export default ReviewsAndRatings
