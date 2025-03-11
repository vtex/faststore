import dynamic from 'next/dynamic'

const UIRatingSummary = dynamic(() =>
  /* webpackChunkName: "UIRatingSummary" */
  import('@faststore/ui').then((module) => module.RatingSummary)
)

export const ReviewsAndRatingsDefaultComponents = {
  RatingSummary: UIRatingSummary,
} as const
