import type { Resolver } from '..'

// TODO: Add a review system integration
export const StoreAggregateRating: Record<string, Resolver> = {
  ratingValue: () => 5,
  reviewCount: () => 0,
}
