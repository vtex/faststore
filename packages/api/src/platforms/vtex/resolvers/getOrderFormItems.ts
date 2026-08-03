import type { GraphqlContext } from '..'
import type { QueryOrderFormItemsArgs } from '../../../__generated__/schema'
import { BadRequestError } from '../../errors'

export const getOrderFormItems = async (
  _: unknown,
  { orderFormId }: QueryOrderFormItemsArgs,
  { clients: { commerce } }: GraphqlContext
) => {
  if (!orderFormId) {
    throw new BadRequestError('Missing orderFormId')
  }

  const { items } = await commerce.orderEntry.getOrderFormItems({ orderFormId })
  return (items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    listPrice: item.listPrice,
    quantity: item.quantity,
    imageUrl: item.imageUrl ?? null,
    availability: item.availability,
    seller: item.seller,
    unitMultiplier: item.unitMultiplier ?? 1,
  }))
}
