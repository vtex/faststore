import deepEquals from 'fast-deep-equal'

import { md5 } from '../utils/md5'
import type {
  IStoreCart,
  IStoreOffer,
  IStoreOrder,
  IStorePropertyValue,
} from '../../../__generated__/schema'
import type {
  OrderForm,
  OrderFormInputItem,
  OrderFormItem,
} from '../clients/commerce/types/OrderForm'
import type { Context } from '..'
import {
  attachmentToPropertyValue,
  getPropertyId,
  VALUE_REFERENCES,
} from '../utils/propertyValue'

type Indexed<T> = T & { index?: number }

const isAttachment = (value: IStorePropertyValue) =>
  value.valueReference === VALUE_REFERENCES.attachment

const getId = (item: IStoreOffer) =>
  [
    item.itemOffered.sku,
    item.seller.identifier,
    item.price,
    item.itemOffered.additionalProperty
      ?.filter(isAttachment)
      .map(getPropertyId)
      .join('-'),
  ]
    .filter(Boolean)
    .join('::')

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
    additionalProperty: item.attachments.map(attachmentToPropertyValue),
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
  attachments: (
    offer.itemOffered.additionalProperty?.filter(isAttachment) ?? []
  ).map((attachment) => ({
    name: attachment.name,
    content: attachment.value,
  })),
})

const groupById = (offers: IStoreOffer[]): Map<string, IStoreOffer> =>
  offers.reduce((acc, item) => {
    const id = getId(item)

    acc.set(id, acc.get(id) ?? item)

    return acc
  }, new Map<string, IStoreOffer>())

const equals = (storeOrder: IStoreOrder, orderForm: OrderForm) => {
  const pick = (item: Indexed<IStoreOffer>, index: number) => ({
    ...item,
    itemOffered: {
      sku: item.itemOffered.sku,
    },
    index,
  })

  const orderFormItems = orderForm.items.map(orderFormItemToOffer).map(pick)
  const storeOrderItems = storeOrder.acceptedOffer.map(pick)

  const isSameOrder = storeOrder.orderNumber === orderForm.orderFormId
  const orderItemsAreSync = deepEquals(orderFormItems, storeOrderItems)

  return isSameOrder && orderItemsAreSync
}

const orderFormToCart = async (
  form: OrderForm,
  skuLoader: Context['loaders']['skuLoader']
) => {
  return {
    order: {
      orderNumber: form.orderFormId,
      acceptedOffer: form.items.map(async (item) => ({
        ...item,
        product: await skuLoader.load(item.id), // TODO: add channel
      })),
    },
    messages: form.messages.map(({ text, status }) => ({
      text,
      status: status.toUpperCase(),
    })),
  }
}

const getOrderFormEtag = ({ items }: OrderForm) => md5(JSON.stringify(items))

const setOrderFormEtag = async (
  form: OrderForm,
  commerce: Context['clients']['commerce']
) => {
  try {
    const orderForm = await commerce.checkout.setCustomData({
      id: form.orderFormId,
      appId: 'faststore',
      key: 'cartEtag',
      value: getOrderFormEtag(form),
    })

    return orderForm
  } catch (err) {
    console.error(
      'Error while setting custom data to orderForm.\n Make sure to add the following custom app to the orderForm: \n{"fields":["cartEtag"],"id":"faststore","major":1}.\n More info at: https://developers.vtex.com/vtex-rest-api/docs/customizable-fields-with-checkout-api'
    )

    throw err
  }
}

/**
 * Checks if cartEtag stored on customData is up to date
 * @description If cartEtag is not up to date, this means that
 * another system changed the cart, like Checkout UI or Order Placed
 */
const isOrderFormStale = (form: OrderForm) => {
  const faststoreData = form.customData?.customApps.find(
    (app) => app.id === 'faststore'
  )

  const oldEtag = faststoreData?.fields?.cartEtag

  if (oldEtag == null) {
    return true
  }

  const newEtag = getOrderFormEtag(form)

  return newEtag !== oldEtag
}

/**
 * This resolver implements the optimistic cart behavior. The main idea in here
 * is that we receive a cart from the UI (as query params) and we validate it with
 * the commerce platform. If the cart is valid, we return null, if the cart is
 * invalid according to the commerce platform, we return the new cart the UI should use
 * instead.
 *
 * The algorithm is something like:
 * 1. Fetch orderForm from VTEX
 * 2. Compute delta changes between the orderForm and the UI's cart
 * 3. Update the orderForm in VTEX platform accordingly
 * 4. If any changes were made, send to the UI the new cart. Null otherwise
 */
export const validateCart = async (
  _: unknown,
  { cart: { order } }: { cart: IStoreCart },
  ctx: Context
) => {
  const { enableOrderFormSync } = ctx.storage.flags
  const { orderNumber, acceptedOffer } = order
  const {
    clients: { commerce },
    loaders: { skuLoader },
  } = ctx

  // Step1: Get OrderForm from VTEX Commerce
  const orderForm = await commerce.checkout.orderForm({
    id: orderNumber,
  })

  // Step1.5: Check if another system changed the orderForm with this orderNumber
  // If so, this means the user interacted with this cart elsewhere and expects
  // to see this new cart state instead of what's stored on the user's browser.
  if (enableOrderFormSync === true) {
    const isStale = isOrderFormStale(orderForm)

    if (isStale === true && orderNumber) {
      const newOrderForm = await setOrderFormEtag(orderForm, commerce)

      return orderFormToCart(newOrderForm, skuLoader)
    }
  }

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
  const updatedOrderForm = await commerce.checkout
    // update orderForm items
    .updateOrderFormItems({
      id: orderForm.orderFormId,
      orderItems: changes,
    })
    // update orderForm etag so we know last time we touched this orderForm
    .then((form) =>
      enableOrderFormSync ? setOrderFormEtag(form, commerce) : form
    )

  // Step5: If no changes detected before/after updating orderForm, the order is validated
  if (equals(order, updatedOrderForm)) {
    return null
  }

  // Step6: There were changes, convert orderForm to StoreCart
  return orderFormToCart(updatedOrderForm, skuLoader)
}
