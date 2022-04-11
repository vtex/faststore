import type { Context } from '..'
import type { MutationAddOfferingArgs } from '../../../__generated__/schema'
import type { OrderFormItem } from '../clients/commerce/types/OrderForm'

export const addOffering = async (
  _: any,
  { offering: { orderNumber, itemIndex, id } }: MutationAddOfferingArgs,
  ctx: Context
) => {
  const {
    clients: { commerce },
  } = ctx

  const orderForm = await ctx.clients.commerce.checkout.orderForm({
    id: orderNumber,
  })

  const originItem = orderForm.items[itemIndex]

  if (!originItem) throw new Error(`No item with index ${itemIndex} was found`)

  const originItemOffering = originItem.offerings.find(
    (offering) => offering.id === id
  )

  if (!originItemOffering)
    throw new Error(`No offering with id ${id} was found`)

  const updatedOrderForm = await commerce.checkout.addOffering({
    orderNumber,
    itemIndex,
    id,
  })

  return {
    orderNumber: updatedOrderForm.orderFormId,
    items: updatedOrderForm.items.map((item: OrderFormItem, index: number) => ({
      ...item,
      itemIndex: index,
    })),
  }
}
