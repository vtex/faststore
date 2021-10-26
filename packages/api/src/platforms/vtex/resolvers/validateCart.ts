import deepEquals from 'fast-deep-equal'

import type { IStoreCart, IStoreOffer } from '../../../__generated__/schema'
import type {
  OrderForm,
  OrderFormItem,
  OrderFormInputItem,
} from '../clients/commerce/types/OrderForm'
import type { Context } from '..'

type Indexed<T> = T & { index?: number }

const getId = (item: IStoreOffer) =>
  [item.itemOffered.sku, item.seller.identifier, item.price].join('::')

const orderFormItemToOffer = (
  item: OrderFormItem,
  index?: number
): Indexed<IStoreOffer> => ({
  listPrice: item.listPrice / 100,
  price: item.sellingPrice / 100,
  quantity: item.quantity,
  seller: { identifier: item.seller },
  itemOffered: {
    sku: item.id,
    image: [],
    name: item.name,
  },
  index,
})

const offerToOrderItemInput = (
  offer: Indexed<IStoreOffer>
): OrderFormInputItem => ({
  quantity: offer.quantity,
  seller: offer.seller.identifier,
  id: offer.itemOffered.sku,
  index: offer.index,
})

const groupById = (offers: IStoreOffer[]): Map<string, IStoreOffer> =>
  offers.reduce((acc, item) => {
    const id = getId(item)

    acc.set(id, acc.get(id) ?? item)

    return acc
  }, new Map<string, IStoreOffer>())

const equals = (of1: OrderForm, of2: OrderForm) => {
  const pick = ({ orderFormId, messages, items, salesChannel }: OrderForm) => ({
    orderFormId,
    messages,
    salesChannel,
    items: items.map(
      ({ uniqueId, quantity, seller, sellingPrice, availability }) => ({
        uniqueId,
        quantity,
        seller,
        sellingPrice,
        availability,
      })
    ),
  })

  return deepEquals(pick(of1), pick(of2))
}

/**
 * This resolver implements the optimistic cart behavior. The main idea in here
 * is that we receive a cart from the UI (as query params) and we validate it with
 * the commerce platform. If the cart is valid, we return null, if the cart is
 * invalid according to the commerce platform, we return the new cart the UI should use
 * instead
 *
 * The algoritm is something like:
 * 1. Fetch orderForm from VTEX
 * 2. Compute delta changes between the orderForm and the UI's cart
 * 3. Update the orderForm in VTEX platform accordingly
 * 4. If any chages were made, send to the UI the new cart. Null otherwise
 */
export const validateCart = async (
  _: unknown,
  {
    cart: {
      order: { orderNumber, acceptedOffer },
    },
  }: { cart: IStoreCart },
  ctx: Context
) => {
  const {
    clients: { commerce },
    loaders: { skuLoader },
  } = ctx

  // Step1: Get OrderForm from VTEX Commerce
  const orderForm = await commerce.checkout.orderForm({
    id: orderNumber,
  })

  // Step2: Process items from both browser and checkout so they have the same shape
  const browserItemsById = groupById(acceptedOffer)
  const originItemsById = groupById(orderForm.items.map(orderFormItemToOffer))
  const browserItems = Array.from(browserItemsById.values()) // items on the user's browser
  const originItems = Array.from(originItemsById.values()) // items on the VTEX platform backend

  // Step3: Compute delta changes
  const { itemsToAdd, itemsToUpdate } = browserItems.reduce(
    (acc, item) => {
      const maybeOriginItem = originItemsById.get(getId(item))

      if (!maybeOriginItem) {
        acc.itemsToAdd.push(item)
      } else {
        acc.itemsToUpdate.push({
          ...maybeOriginItem,
          quantity: item.quantity,
        })
      }

      return acc
    },
    {
      itemsToAdd: [] as IStoreOffer[],
      itemsToUpdate: [] as IStoreOffer[],
    }
  )

  const itemsToDelete = originItems
    .filter((item) => !browserItemsById.has(getId(item)))
    .map((item) => ({ ...item, quantity: 0 }))

  const changes = [...itemsToAdd, ...itemsToUpdate, ...itemsToDelete].map(
    offerToOrderItemInput
  )

  if (changes.length === 0) {
    return null
  }

  // Step4: Apply delta changes to order form
  const updatedOrderForm = await commerce.checkout.updateOrderFormItems({
    id: orderForm.orderFormId,
    orderItems: changes,
  })

  // Step5: If no changes detected before/after updating orderForm, the order is validated
  if (equals(orderForm, updatedOrderForm)) {
    return null
  }

  // Step6: There were changes, convert orderForm to StoreOrder
  return {
    order: {
      orderNumber: updatedOrderForm.orderFormId,
      acceptedOffer: updatedOrderForm.items.map((item) => ({
        ...item,
        product: skuLoader.load([{ key: 'id', value: item.id }]), // TODO: add channel
      })),
    },
    messages: updatedOrderForm.messages.map(({ text, status }) => ({
      text,
      status: status.toUpperCase(),
    })),
  }
}
