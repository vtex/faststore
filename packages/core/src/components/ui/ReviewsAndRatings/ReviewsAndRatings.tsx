import { useUI } from '@faststore/components'
import type { AddReviewModalProps } from 'src/components/reviews/AddReviewModal/AddReviewModal'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'
import { usePDP } from 'src/sdk/overrides/PageProvider'

export type ReviewsAndRatingsProps = {
  title: string
  addReviewModal: Omit<AddReviewModalProps, 'product'>
}

function ReviewsAndRatings({ title, addReviewModal }: ReviewsAndRatingsProps) {
  const { AddReviewModalButton, __experimentalAddReviewModal: AddReviewModal } =
    useOverrideComponents<'ReviewsAndRatings'>()
  const { openAddReviewModal, addReviewModal: displayAddReviewModal } = useUI()
  const context = usePDP()
  const { product, isValidating } = context.data

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

      {displayAddReviewModal && !isValidating && (
        <AddReviewModal.Component
          {...addReviewModal}
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
