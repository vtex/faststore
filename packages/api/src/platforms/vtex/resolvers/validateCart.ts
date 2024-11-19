import deepEquals from 'fast-deep-equal'

import { mutateChannelContext, mutateLocaleContext } from '../utils/contex'
import { md5 } from '../utils/md5'
import {
  attachmentToPropertyValue,
  getPropertyId,
  VALUE_REFERENCES,
} from '../utils/propertyValue'
import { parse } from 'cookie'

import type { Context } from '..'
import type {
  IStoreOffer,
  IStoreOrder,
  IStorePropertyValue,
  IStoreSession,
  Maybe,
  MutationValidateCartArgs,
} from '../../../__generated__/schema'
import type {
  OrderForm,
  OrderFormInputItem,
  OrderFormItem,
} from '../clients/commerce/types/OrderForm'
import { shouldUpdateShippingData } from '../utils/shouldUpdateShippingData'
import { getAddressOrderForm } from '../utils/getAddressOrderForm'
import { SelectedAddress } from '../clients/commerce/types/ShippingData'
import { createNewAddress } from '../utils/createNewAddress'

type Indexed<T> = T & { index?: number }

const isAttachment = (value: IStorePropertyValue) =>
  value.valueReference === VALUE_REFERENCES.attachment

const getId = (item: IStoreOffer) =>
  [
    item.itemOffered.sku,
    item.seller.identifier,
    item.price < 0.01 ? 'Gift' : undefined,
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

const groupById = (offers: IStoreOffer[]): Map<string, IStoreOffer[]> =>
  offers.reduce((acc, item) => {
    const id = getId(item)

    if (!acc.has(id)) {
      acc.set(id, [])
    }

    acc.get(id)?.push(item)

    return acc
  }, new Map<string, IStoreOffer[]>())

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

function hasChildItem(items: OrderFormItem[], itemId: string) {
  return items?.some(
    (item) =>
      item.parentItemIndex !== null &&
      item.parentItemIndex !== undefined &&
      items[item.parentItemIndex]?.id === itemId
  )
}

function hasParentItem(items: OrderFormItem[], itemId: string) {
  return items?.some(
    (item) => item.id === itemId && item.parentItemIndex !== null
  )
}

const joinItems = (form: OrderForm) => {
  const itemsById = form.items.reduce(
    (acc, item, idx) => {
      const id =
        hasParentItem(form.items, item.id) || hasChildItem(form.items, item.id)
          ? `${getId(orderFormItemToOffer(item))}::${idx}`
          : getId(orderFormItemToOffer(item))

      if (!acc[id]) {
        acc[id] = []
      }

      acc[id].push(item)

      return acc
    },
    {} as Record<string, OrderFormItem[]>
  )

  return {
    ...form,
    items: Object.values(itemsById).map((items) => {
      const [item] = items
      const quantity = items.reduce((acc, i) => acc + i.quantity, 0)
      const totalPrice = items.reduce(
        (acc, i) =>
          acc +
          (i?.priceDefinition?.total ??
            (i?.quantity ?? 0) * (i?.sellingPrice ?? 0)),
        0
      )

      return {
        ...item,
        quantity,
        sellingPrice: totalPrice / quantity,
      }
    }),
  }
}

const orderFormToCart = async (
  form: OrderForm,
  skuLoader: Context['loaders']['skuLoader'],
  shouldSplitItem?: boolean | null
) => {
  return {
    order: {
      orderNumber: form.orderFormId,
      acceptedOffer: form.items.map(async (item) => ({
        ...item,
        product: await skuLoader.load(`${item.id}-invisibleItems`),
      })),
      shouldSplitItem,
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

// Returns the regionalized orderForm
const getOrderForm = async (id: string, { clients: { commerce } }: Context) => {
  return commerce.checkout.orderForm({
    id,
  })
}

const clearOrderFormMessages = async (
  id: string,
  { clients: { commerce } }: Context
) => {
  return commerce.checkout.clearOrderFormMessages({
    id,
  })
}

const updateOrderFormShippingData = async (
  orderForm: OrderForm,
  session: Maybe<IStoreSession> | undefined,
  { clients: { commerce } }: Context
) => {
  // Stores that are not yet providing the session while validating the cart
  // should not be able to update the shipping data
  //
  // This was causing errors while validating regionalizated carts
  // because the following code was trying to change the shippingData to an undefined address/session

  if (!session) {
    return orderForm
  }

  const { updateShipping, addressChanged } = shouldUpdateShippingData(
    orderForm,
    session
  )

  if (updateShipping) {
    // Check if the orderForm address matches the one from the session
    const oldAddress = getAddressOrderForm(orderForm, session, addressChanged)

    const address = oldAddress ? oldAddress : createNewAddress(session)

    const selectedAddresses = address as SelectedAddress[]

    const hasDeliveryWindow = session.deliveryMode?.deliveryWindow
      ? true
      : false

    if (hasDeliveryWindow) {
      // if you have a Delivery Window you have to first get the delivery window to set the desired after
      await commerce.checkout.shippingData(
        {
          id: orderForm.orderFormId,
          index: orderForm.items.length,
          deliveryMode: session.deliveryMode,
          selectedAddresses: selectedAddresses,
        },
        false
      )
    }

    return commerce.checkout.shippingData(
      {
        id: orderForm.orderFormId,
        index: orderForm.items.length,
        deliveryMode: session.deliveryMode,
        selectedAddresses: selectedAddresses,
      },
      true
    )
  }
  return orderForm
}

const getCookieCheckoutOrderNumber = (ctx: string, nameCookie: string) => {
  if (!ctx) {
    return ''
  }

  const cookies = parse(ctx)
  const cookieValue = cookies[nameCookie]
  return cookieValue ? cookieValue.split('=')[1] : ''
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
  { cart: { order }, session }: MutationValidateCartArgs,
  ctx: Context
) => {
  const orderNumber = order?.orderNumber
    ? order.orderNumber
    : getCookieCheckoutOrderNumber(ctx.headers.cookie, 'checkout.vtex.com')

  const { acceptedOffer, shouldSplitItem } = order
  const {
    clients: { commerce },
    loaders: { skuLoader },
  } = ctx

  const channel = session?.channel
  const locale = session?.locale

  if (channel) {
    mutateChannelContext(ctx, channel)
  }

  if (locale) {
    mutateLocaleContext(ctx, locale)
  }

  // Step1: Get OrderForm from VTEX Commerce
  const orderForm = await getOrderForm(orderNumber, ctx)

  // Clear messages so it doesn't keep populating toasts on a loop
  // In the next validateCart mutation it will only have messages if a new message is created on orderForm
  if (orderForm.messages.length !== 0) {
    await clearOrderFormMessages(orderNumber, ctx)
  }

  // Step1.5: Check if another system changed the orderForm with this orderNumber
  // If so, this means the user interacted with this cart elsewhere and expects
  // to see this new cart state instead of what's stored on the user's browser.
  const isStale = isOrderFormStale(orderForm)

  if (isStale) {
    const newOrderForm = await setOrderFormEtag(orderForm, commerce).then(
      joinItems
    )
    if (orderNumber) {
      return orderFormToCart(newOrderForm, skuLoader, shouldSplitItem)
    }
  }

  // Step2: Process items from both browser and checkout so they have the same shape
  const browserItemsById = groupById(acceptedOffer)
  const originItemsById = groupById(orderForm.items.map(orderFormItemToOffer))
  const originItems = Array.from(originItemsById.entries()) // items on the VTEX platform backend
  const browserItems = Array.from(browserItemsById.entries()) // items on the user's browser

  // Step3: Compute delta changes
  const { itemsToAdd, itemsToUpdate } = browserItems.reduce(
    (acc, [id, items]) => {
      const maybeOriginItem = originItemsById.get(id)

      // Adding new items to cart
      if (!maybeOriginItem) {
        items.forEach((item) => acc.itemsToAdd.push(item))

        return acc
      }

      // Update existing items
      const [head, ...tail] = maybeOriginItem

      if (
        hasParentItem(orderForm.items, head.itemOffered.sku) ||
        hasChildItem(orderForm.items, head.itemOffered.sku)
      ) {
        acc.itemsToUpdate.push(head)

        return acc
      }

      const totalQuantity = items.reduce((acc, curr) => acc + curr.quantity, 0)

      // set total quantity to first item
      acc.itemsToUpdate.push({
        ...head,
        quantity: totalQuantity,
      })

      // Remove all the rest
      tail.forEach((item) => acc.itemsToUpdate.push({ ...item, quantity: 0 }))

      return acc
    },
    {
      itemsToAdd: [] as IStoreOffer[],
      itemsToUpdate: [] as IStoreOffer[],
    }
  )

  const itemsToDelete = originItems
    .filter(([id]) => !browserItemsById.has(id))
    .flatMap(([, items]) => items.map((item) => ({ ...item, quantity: 0 })))

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
      shouldSplitItem,
    })
    // update orderForm shippingData
    .then((form: OrderForm) => updateOrderFormShippingData(form, session, ctx))
    // update orderForm etag so we know last time we touched this orderForm
    .then((form: OrderForm) => setOrderFormEtag(form, commerce))
    .then(joinItems)

  const equalMessages = deepEquals(
    orderForm.messages,
    updatedOrderForm.messages
  )

  // Step5: If no changes detected before/after updating orderForm, the order is validated
  if (equals(order, updatedOrderForm) && equalMessages) {
    return null
  }

  // Step6: There were changes, convert orderForm to StoreCart
  return orderFormToCart(updatedOrderForm, skuLoader, shouldSplitItem)
}
