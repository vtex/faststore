import dynamic from 'next/dynamic'

const UIRatingSummary = dynamic(() =>
  /* webpackChunkName: "UIRatingSummary" */
  import('@faststore/ui').then((module) => module.RatingSummary)
)

const ReviewList = dynamic(
  () =>
    /* webpackChunkName: "ReviewList" */
    import('src/components/reviews/ReviewList')
)

export const ReviewsAndRatingsDefaultComponents = {
  RatingSummary: UIRatingSummary,
  __experimentalReviewList: ReviewList,
} as const
