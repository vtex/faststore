import type { Context } from '..'
import type { MutationCreateProductReviewArgs } from '../../../__generated__/schema'

export const createProductReview = async (
  _: any,
  { data }: MutationCreateProductReviewArgs,
  {
    clients: {
      apps: { reviewsAndRatings },
    },
  }: Context
): Promise<string> => {
  return await reviewsAndRatings.reviews.create({
    ...data,
    approved: true,
  })
}
