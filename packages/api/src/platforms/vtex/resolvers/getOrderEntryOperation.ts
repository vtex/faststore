import type { Context } from '..'
import type { QueryOrderEntryOperationArgs } from '../../../__generated__/schema'
import { BadRequestError } from '../../errors'

export const getOrderEntryOperation = async (
  _: unknown,
  { operationId }: QueryOrderEntryOperationArgs,
  { clients: { commerce } }: Context
) => {
  if (!operationId) {
    throw new BadRequestError('Missing operationId')
  }

  return commerce.orderEntry.getOperation({ operationId })
}
