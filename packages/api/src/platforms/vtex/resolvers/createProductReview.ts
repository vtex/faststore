import type { Context } from '..'
import type { MutationCreateProductReviewArgs } from '../../../__generated__/schema'

export const createProductReview = async (
  _: any,
  { data }: MutationCreateProductReviewArgs,
  { clients: { commerce } }: Context
): Promise<string> => {
  return commerce.reviews.create({
    ...data,
    approved: true,
  })
}
