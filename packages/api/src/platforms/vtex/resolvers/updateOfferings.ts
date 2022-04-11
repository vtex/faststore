import type { Context } from '..'
import type {
  MutationUpdateOfferingsArgs,
  IStoreProductOfferings,
  IStoreProductOffering,
} from '../../../__generated__/schema'
import type {
  OrderFormItem,
  BundleItem,
} from '../clients/commerce/types/OrderForm'

const bundleItemsToStoreProductOffering = (bundleItems: BundleItem[]) => {
  if (!bundleItems.length) return []

  return bundleItems.map((item: IStoreProductOffering) => ({
    id: item.id,
    name: item.name,
  }))
}

const orderFormItemToOffering = (
  item: OrderFormItem,
  index: number
): IStoreProductOfferings => ({
  sku: item.skuName,
  index,
  offerings: bundleItemsToStoreProductOffering(item.bundleItems),
})

export const updateOfferings = async (
  _: any,
  { offerings: { orderNumber, productOfferings } }: MutationUpdateOfferingsArgs,
  ctx: Context
) => {
  const orderForm = await ctx.clients.commerce.checkout.orderForm({
    id: orderNumber,
  })

  const originItems = orderForm.items.map(orderFormItemToOffering)

  const { offeringsToAdd, offeringsToRemove } = productOfferings.reduce(
    (acc, item) => {
      const originItem = originItems[item.index]

      return acc
    },
    {
      offeringsToAdd: [],
      offeringsToRemove: [],
    }
  )

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

  return { ...orderForm, productOfferings }
}
