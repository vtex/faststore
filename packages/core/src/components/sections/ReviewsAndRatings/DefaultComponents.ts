import { Button as UIButton } from '@faststore/ui'

import dynamic from 'next/dynamic'

const AddReviewModal = dynamic(
  () =>
    /* webpackChunkName: "AddReviewModal" */
    import('src/components/reviews/AddReviewModal')
)

export const ReviewsAndRatingsDefaultComponents = {
  // TODO: Update this with the components that will be used in ReviewsAndRatings section
  // Olhar o packages/core/src/components/sections/ProductGallery/DefaultComponents.ts
  // ou o packages/core/src/components/sections/ProductShelf/DefaultComponents.ts
  // para se basear

  // TODO: This button is just for now, to be able to see and
  // open the modal until the final component is done
  AddReviewModalButton: UIButton,
  __experimentalAddReviewModal: AddReviewModal,
} as const
