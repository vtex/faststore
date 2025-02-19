import dynamic from 'next/dynamic'

const UIRatingSummary = dynamic(() =>
  /* webpackChunkName: "UIRatingSummary" */
  import('@faststore/ui').then((mod) => mod.RatingSummary)
)

const AddReviewModal = dynamic(
  () =>
    /* webpackChunkName: "AddReviewModal" */
    import('src/components/reviews/AddReviewModal')
)

export const ReviewsAndRatingsDefaultComponents = {
  RatingSummary: UIRatingSummary,
  __experimentalAddReviewModal: AddReviewModal,
} as const
