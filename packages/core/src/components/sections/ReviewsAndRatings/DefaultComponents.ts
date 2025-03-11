import dynamic from 'next/dynamic'

const UIRatingSummary = dynamic(() =>
  /* webpackChunkName: "UIRatingSummary" */
  import('@faststore/ui').then((module) => module.RatingSummary)
)

export const ReviewsAndRatingsDefaultComponents = {
  // TODO: Update this with the components that will be used in ReviewsAndRatings section
  // Olhar o packages/core/src/components/sections/ProductGallery/DefaultComponents.ts
  // ou o packages/core/src/components/sections/ProductShelf/DefaultComponents.ts
  // para se basear
  RatingSummary: UIRatingSummary,
} as const
