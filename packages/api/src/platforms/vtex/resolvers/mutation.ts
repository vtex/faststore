import { subscribeToNewsletter } from './subscribeToNewsletter'
import { validateCart } from './validateCart'
import { validateSession } from './validateSession'
import { createProductReview } from './createProductReview'
import { deleteProductReview } from './deleteProductReview'

export const Mutation = {
  validateCart,
  validateSession,
  subscribeToNewsletter,
  createProductReview,
  deleteProductReview,
}
