import dynamic from 'next/dynamic'

const UIRatingSummary = dynamic(() =>
  /* webpackChunkName: "UIRatingSummary" */
  import('@faststore/ui').then((module) => module.RatingSummary)
)

const RatingSummarySkeleton = dynamic(
  () =>
    /* webpackChunkName: "RatingSummarySkeleton" */
    import('src/components/skeletons/RatingSummarySkeleton')
)

const ReviewModal = dynamic(
  () =>
    /* webpackChunkName: "ReviewModal" */
    import('src/components/reviews/ReviewModal')
)

const ReviewList = dynamic(
  () =>
    /* webpackChunkName: "ReviewList" */
    import('src/components/reviews/ReviewList')
)

export const ReviewsAndRatingsDefaultComponents = {
  RatingSummary: UIRatingSummary,
  __experimentalRatingSummarySkeleton: RatingSummarySkeleton,
  __experimentalReviewModal: ReviewModal,
  __experimentalReviewList: ReviewList,
} as const
