import type { GraphqlResolver } from '..'

// TODO: Add a review system integration
export const StoreAggregateRating: Record<string, GraphqlResolver> = {
  ratingValue: () => 5,
  reviewCount: () => 0,
}
