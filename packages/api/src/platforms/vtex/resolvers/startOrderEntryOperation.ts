import type { Context } from '..'
import type { MutationStartOrderEntryOperationArgs } from '../../../__generated__/schema'
import { BadRequestError } from '../../errors'

export const startOrderEntryOperation = async (
  _: unknown,
  { data }: MutationStartOrderEntryOperationArgs,
  { clients: { commerce } }: Context
) => {
  if (!data?.objectKey) {
    throw new BadRequestError('Missing objectKey')
  }

  const { orderFormId } = await commerce.orderEntry.createOrderForm()

  return commerce.orderEntry.startOperation({
    objectKey: data.objectKey,
    orderFormId,
    sessionToken: data.sessionToken ?? undefined,
  })
}
