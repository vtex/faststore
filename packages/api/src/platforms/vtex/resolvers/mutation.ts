import { cancelOrder } from './cancelOrder'
import { processOrderAuthorization } from './processOrderAuthorization'
import { setPassword } from './setPassword'
import { subscribeToNewsletter } from './subscribeToNewsletter'
import { validateCart } from './validateCart'
import { validateSession } from './validateSession'

export const Mutation = {
  validateCart,
  validateSession,
  subscribeToNewsletter,
  cancelOrder,
  processOrderAuthorization,
  setPassword,
}
