import { cancelOrder } from './cancelOrder'
import { processOrderAuthorization } from './processOrderAuthorization'
import { startOrderEntryOperation } from './startOrderEntryOperation'
import { startRecommendationSession } from './startRecommendationSession'
import { subscribeToNewsletter } from './subscribeToNewsletter'
import { uploadFileToOrderEntry } from './uploadFileToOrderEntry'
import { validateCart } from './validateCart'
import { validateSession } from './validateSession'

export const Mutation = {
  validateCart,
  validateSession,
  subscribeToNewsletter,
  cancelOrder,
  processOrderAuthorization,
  uploadFileToOrderEntry,
  startOrderEntryOperation,
  startRecommendationSession,
}
