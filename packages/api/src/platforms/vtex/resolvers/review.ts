import type { GraphqlResolver } from '..'

export const StoreReview: Record<string, GraphqlResolver> = {
  reviewRating: () => ({
    ratingValue: 5,
    bestRating: 5,
  }),
  author: () => ({
    name: '',
  }),
}
