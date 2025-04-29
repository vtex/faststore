import type { Context } from '..'
import type {
  IUserOrderCancel,
  UserOrderCancel,
} from '../../../__generated__/schema'
import { BadRequestError, NotFoundError } from '../../errors'

export const cancelOrder = async (
  _: any,
  { orderId, customerEmail, reason }: IUserOrderCancel,
  { clients: { commerce } }: Context
): Promise<UserOrderCancel | null> => {
  if (!orderId) {
    throw new BadRequestError('Missing orderId')
  }

  const response = await commerce.oms.cancelOrder({
    orderId,
    customerEmail,
    reason,
  })

  if (!response) {
    throw new NotFoundError(`No order found for id ${orderId}`)
  }

  return {
    date: response?.date,
    orderId: response?.orderId,
    receipt: response?.receipt,
  }
}
