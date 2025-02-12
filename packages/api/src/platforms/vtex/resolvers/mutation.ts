import { subscribeToNewsletter } from './subscribeToNewsletter'
import { validateCart } from './validateCart'
import { validateSession } from './validateSession'
import { createProductReview } from './createProductReview'

export const Mutation = {
  validateCart,
  validateSession,
  subscribeToNewsletter,
  createProductReview,
}
