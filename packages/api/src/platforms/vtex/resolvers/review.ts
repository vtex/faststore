import type { Resolver } from '..'

export const StoreReview: Record<string, Resolver> = {
  reviewRating: () => ({
    ratingValue: 5,
    bestRating: 5,
  }),
  author: () => ({
    name: '',
  }),
}
