import type { Context } from '..'
import type {
  MutationCancelOrderArgs,
  UserOrderCancel,
} from '../../../__generated__/schema'
import { BadRequestError, NotFoundError } from '../../errors'

export const cancelOrder = async (
  _: any,
  { data }: MutationCancelOrderArgs,
  { clients: { commerce } }: Context
): Promise<UserOrderCancel | null> => {
  if (!data?.orderId) {
    throw new BadRequestError('Missing orderId')
  }

  const response = await commerce.oms.cancelOrder(data)

  if (!response) {
    throw new NotFoundError(`No order found for id ${data?.orderId}`)
  }

  return {
    date: response?.date,
    orderId: response?.orderId,
    receipt: response?.receipt,
  }
}
