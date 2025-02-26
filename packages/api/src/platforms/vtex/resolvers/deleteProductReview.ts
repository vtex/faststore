import type { Context } from '..'
import type { MutationDeleteProductReviewArgs } from '../../../__generated__/schema'

export const deleteProductReview = async (
  _: any,
  { reviewId }: MutationDeleteProductReviewArgs,
  { clients: { commerce } }: Context
): Promise<boolean> => {
  return await commerce.reviews.delete(reviewId)
}
