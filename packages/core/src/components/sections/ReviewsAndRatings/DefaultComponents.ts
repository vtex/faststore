import dynamic from 'next/dynamic'

const UIRatingSummary = dynamic(() =>
  /* webpackChunkName: "UIRatingSummary" */
  import('@faststore/ui').then((module) => module.RatingSummary)
)

const ReviewModal = dynamic(
  () =>
    /* webpackChunkName: "ReviewModal" */
    import('src/components/reviews/ReviewModal')
)

export const ReviewsAndRatingsDefaultComponents = {
  RatingSummary: UIRatingSummary,
  __experimentalReviewModal: ReviewModal,
} as const
