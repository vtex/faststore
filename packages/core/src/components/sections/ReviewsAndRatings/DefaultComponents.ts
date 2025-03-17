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

const RatingSummarySkeleton = dynamic(
  () =>
    /* webpackChunkName: "RatingSummarySkeleton" */
    import('src/components/skeletons/RatingSummarySkeleton')
)

export const ReviewsAndRatingsDefaultComponents = {
  RatingSummary: UIRatingSummary,
  __experimentalRatingSummarySkeleton: RatingSummarySkeleton,
  __experimentalReviewModal: ReviewModal,
} as const
