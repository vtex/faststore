import type { Context } from '..'
import type { MutationAddOfferingArgs } from '../../../__generated__/schema'

export const addOffering = async (
  _: any,
  { offering: { orderNumber, itemIndex, id } }: MutationAddOfferingArgs,
  ctx: Context
) => {
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

  return [
    {
      type: 'eae',
      id: 'teste',
      name: 'wololo',
      allowGiftMessage: false,
      attachmentOfferings: [
        {
          name: 'eae',
        },
      ],
      price: 15,
    },
  ]

  return { ...orderForm }
}
