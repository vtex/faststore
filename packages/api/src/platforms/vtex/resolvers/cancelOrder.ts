import type { GraphqlContext } from '..'
import type {
  MutationCancelOrderArgs,
  UserOrderCancel,
} from '../../../__generated__/schema'
import { BadRequestError } from '../../errors'

export const cancelOrder = async (
  _: any,
  { data }: MutationCancelOrderArgs,
  { clients: { commerce } }: GraphqlContext
): Promise<UserOrderCancel | null> => {
  if (!data?.orderId) {
    throw new BadRequestError('Missing orderId')
  }

  const response = await commerce.checkout.cancelOrder(data)
  return { data: response?.data }
}
