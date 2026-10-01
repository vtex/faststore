import deepEquals from 'fast-deep-equal'

import { parse } from 'cookie'
import {
  channelWhenSessionDivergesFromOrderForm,
  shouldTrustOrderFormSalesChannel,
} from '../utils/cartSalesChannel'
import { salesChannelSourceOf } from '../utils/sessionChannel'
import { mutateChannelContext, mutateLocaleContext } from '../utils/contex'
import { md5 } from '../utils/md5'
import {
  attachmentToPropertyValue,
  getPropertyId,
  getServiceKey,
  serviceToPropertyValue,
  VALUE_REFERENCES,
} from '../utils/propertyValue'

import type { GraphqlContext } from '..'
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
import type { SelectedAddress } from '../clients/commerce/types/ShippingData'
import { createNewAddress } from '../utils/createNewAddress'
import { getAddressOrderForm } from '../utils/getAddressOrderForm'
import { shouldUpdateShippingData } from '../utils/shouldUpdateShippingData'
import { parseJwt } from '../utils/cookies'
import type { SessionJwt } from '../clients/commerce/types/Session'

type Indexed<T> = T & { index?: number }

const isAttachment = (value: IStorePropertyValue) =>
  value.valueReference === VALUE_REFERENCES.attachment

const isService = (value: IStorePropertyValue) =>
  value.valueReference === VALUE_REFERENCES.service

/** Sorted keys of the services applied to a line; independent of their order. */
const getServiceKeys = (item: IStoreOffer) =>
  (item.itemOffered.additionalProperty ?? [])
    .filter(isService)
    .map(getServiceKey)
    .sort((a, b) => a.localeCompare(b))

/**
 * Identity segment for services. Checkout treats a unit with a service as a
 * different line from one without, so FastStore must too: otherwise the delta
 * merges them and either replicates or drops the service. Empty when the line
 * has no services, so ids of unserviced lines are unchanged.
 */
const getServiceSegment = (item: IStoreOffer) => {
  const keys = getServiceKeys(item)

  return keys.length > 0 ? `services:${keys.join('-')}` : undefined
}

const getId = (item: IStoreOffer) =>
  [
    item.itemOffered.sku,
    item.seller.identifier,
    item.price < 0.01 ? 'Gift' : undefined,
    item.itemOffered.additionalProperty
      ?.filter(isAttachment)
      .map(getPropertyId)
      .join('-'),
    getServiceSegment(item),
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
    additionalProperty: [
      ...item.attachments.map(attachmentToPropertyValue),
      ...(item.bundleItems ?? []).map(serviceToPropertyValue),
    ],
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
  ...(offer.priceToken ? { priceToken: offer.priceToken } : {}),
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
  // Omit priceToken: it exists on the browser payload but not on orderForm items.
  // Compare the service segment explicitly: a browser line claiming a service
  // Checkout does not have must not be reported as "in sync".
  const pick = (
    { priceToken: _, ...item }: Indexed<IStoreOffer>,
    index: number
  ) => ({
    ...item,
    itemOffered: {
      sku: item.itemOffered.sku,
    },
    services: getServiceSegment(item),
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
  skuLoader: GraphqlContext['loaders']['skuLoader'],
  shouldSplitItem?: boolean | null,
  adoptedSalesChannel?: string | null
) => {
  return {
    order: {
      orderNumber: form.orderFormId,
      acceptedOffer: form.items.map(async (item) => ({
        ...item,
        product: await skuLoader.load(`${item.id}-invisibleItems`),
      })),
      shouldSplitItem,
      ...(adoptedSalesChannel ? { salesChannel: adoptedSalesChannel } : {}),
    },
    messages: form.messages.map(({ text, status }) => ({
      text,
      status: status.toUpperCase(),
    })),
  }
}

const getOrderFormEtag = ({ items }: OrderForm, sessionJwt: SessionJwt) => {
  // Only include critical item properties in etag to avoid false positives
  // when prices or availability change due to regionalization

  // Include:
  // - id (SKU): to detect item additions/removals
  // - quantity: to detect quantity changes
  // - seller: to detect seller changes
  // - attachments: to detect customizations/personalizations changes
  // - services: to detect services attached/removed outside FastStore. Added
  //   only when the line has services so the etag of every other line (and of
  //   carts without services) stays byte-identical to the previous algorithm.
  const criticalItems = items.map((item) => {
    const services = (item.bundleItems ?? [])
      .map(serviceToPropertyValue)
      .map(({ propertyID }) => propertyID)
      .sort((a, b) => a.localeCompare(b))

    return {
      id: item.id,
      quantity: item.quantity,
      seller: item.seller,
      attachments: item.attachments, // customizations
      ...(services.length > 0 ? { services } : {}),
    }
  })

  return md5(
    JSON.stringify({ sessionId: sessionJwt?.id ?? '', items: criticalItems })
  )
}

const setOrderFormEtag = async (
  form: OrderForm,
  commerce: GraphqlContext['clients']['commerce'],
  sessionJwt: SessionJwt
) => {
  try {
    const orderForm = await commerce.checkout.setCustomData({
      id: form.orderFormId,
      appId: 'faststore',
      key: 'cartEtag',
      value: getOrderFormEtag(form, sessionJwt),
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
 * or another device which has the same cart open with FastStore
 */
const isOrderFormStale = (form: OrderForm, sessionJwt: SessionJwt) => {
  const faststoreData = form.customData?.customApps.find(
    (app) => app.id === 'faststore'
  )

  const oldEtag = faststoreData?.fields?.cartEtag

  if (oldEtag == null) {
    return true
  }

  const newEtag = getOrderFormEtag(form, sessionJwt)

  return newEtag !== oldEtag
}

const clearOrderFormMessages = async (
  id: string,
  { clients: { commerce } }: GraphqlContext
) => {
  return commerce.checkout.clearOrderFormMessages({
    id,
  })
}

const updateOrderFormShippingData = async (
  orderForm: OrderForm,
  session: Maybe<IStoreSession> | undefined,
  { clients: { commerce } }: GraphqlContext
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
 * Fetches the orderForm, omitting `sc` for existing carts so Checkout keeps the
 * SC stored on the cart (unless the session SC comes from the URL).
 *
 * Checkout only stores an SC after an items mutation with `sc`. An empty
 * orderForm fetched without `sc` may report the platform default (SC 1):
 * refetch it with the session SC instead of trusting (and adopting) it.
 */
const getOrderForm = async (
  ctx: GraphqlContext,
  orderFormId: string | undefined,
  isUrlSalesChannel: boolean
) => {
  const { commerce } = ctx.clients
  const orderForm = await commerce.checkout.orderForm({
    id: orderFormId,
    channel: ctx.storage.channel,
    preserveSalesChannel: Boolean(orderFormId) && !isUrlSalesChannel,
  })

  if (
    !orderFormId ||
    shouldTrustOrderFormSalesChannel(
      orderForm,
      ctx.storage.channel.salesChannel
    )
  ) {
    return orderForm
  }

  return commerce.checkout.orderForm({
    id: orderFormId,
    channel: ctx.storage.channel,
  })
}

/**
 * Keep Checkout on the orderForm SC when the browser session lags behind it.
 * Only orderForms with items have a stored SC worth protecting, and a
 * URL-derived (localization) session SC always wins.
 */
const adoptOrderFormSalesChannelWhenSessionDiverges = (
  ctx: GraphqlContext,
  orderForm: OrderForm,
  canAdopt: boolean
): string | null => {
  if (!canAdopt || orderForm.items.length === 0) {
    return null
  }

  const adoptedChannel = channelWhenSessionDivergesFromOrderForm(
    ctx.storage.channel,
    orderForm.salesChannel
  )

  if (adoptedChannel) {
    mutateChannelContext(ctx, adoptedChannel)
    return orderForm.salesChannel ? String(orderForm.salesChannel) : null
  }

  return null
}

/** Return a cart only when an SC was adopted (so the client can sync session). */
const cartWhenSalesChannelAdoptedOrNull = (
  form: OrderForm,
  skuLoader: GraphqlContext['loaders']['skuLoader'],
  shouldSplitItem: boolean | null | undefined,
  adoptedSalesChannel: string | null
) => {
  if (!adoptedSalesChannel) {
    return null
  }

  return orderFormToCart(form, skuLoader, shouldSplitItem, adoptedSalesChannel)
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
  ctx: GraphqlContext
) => {
  const orderFormIdFromCookie = getCookieCheckoutOrderNumber(
    ctx.headers.cookie,
    'checkout.vtex.com'
  )
  const {
    clients: { commerce },
    loaders: { skuLoader },
  } = ctx

  const channel = session?.channel
  const locale = session?.locale
  // Localization derives the SC from the URL: never omit `sc` nor adopt.
  const isUrlSalesChannel = salesChannelSourceOf(channel) === 'url'

  if (channel) {
    mutateChannelContext(ctx, channel)
  }

  if (locale) {
    mutateLocaleContext(ctx, locale)
  }

  // Step1: Get OrderForm from VTEX Commerce.
  // For existing carts (`orderFormId` present), omit `sc` on the first GET so
  // Checkout keeps the orderForm's current sales channel. Passing a stale
  // session SC (e.g. after Quick Order) would recalculate the cart and drop
  // items only available in the orderForm's trade policy. New carts still
  // send `sc` from the session (see commerce.checkout.orderForm).
  const orderForm = await getOrderForm(
    ctx,
    orderFormIdFromCookie || undefined,
    isUrlSalesChannel
  )
  const orderNumber = orderForm.orderFormId

  // Clear messages so it doesn't keep populating toasts on a loop
  // In the next validateCart mutation it will only have messages if a new message is created on orderForm
  if (orderForm.messages.length !== 0) {
    await clearOrderFormMessages(orderNumber, ctx)
  }

  const sessionCookie = parse(ctx?.headers?.cookie ?? '')?.vtex_session
  const sessionJwt = parseJwt(sessionCookie)

  const { acceptedOffer, shouldSplitItem } = order

  // Step1.5: Check if another system changed the orderForm with this orderNumber
  // If so, this means the user interacted with this cart elsewhere and expects
  // to see this new cart state instead of what's stored on the user's browser.
  const isStale = isOrderFormStale(orderForm, sessionJwt)

  if (isStale) {
    // Adopt the orderForm SC so subsequent checkout calls (etag, etc.) stay
    // on the trade policy that actually owns the items.
    const adoptedSalesChannel = adoptOrderFormSalesChannelWhenSessionDiverges(
      ctx,
      orderForm,
      !isUrlSalesChannel
    )

    const newOrderForm = await setOrderFormEtag(
      orderForm,
      commerce,
      sessionJwt
    ).then(joinItems)
    if (orderNumber) {
      return orderFormToCart(
        newOrderForm,
        skuLoader,
        shouldSplitItem,
        adoptedSalesChannel
      )
    }
  }

  // Keep Checkout on the orderForm trade policy when the browser session still
  // has a stale SC (Quick Order). Refetching with `sc=session` would wipe
  // items that exist only on the orderForm's sales channel.
  const adoptedSalesChannel = adoptOrderFormSalesChannelWhenSessionDiverges(
    ctx,
    orderForm,
    !isUrlSalesChannel
  )

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

  // Check if shippingData needs to be updated
  const { updateShipping } = session
    ? shouldUpdateShippingData(orderForm, session)
    : { updateShipping: false }

  // If there are no item/shipping changes: still return the cart when we
  // adopted the orderForm SC so the client can align `fs::session`.
  if (changes.length === 0 && !updateShipping) {
    return cartWhenSalesChannelAdoptedOrNull(
      orderForm,
      skuLoader,
      shouldSplitItem,
      adoptedSalesChannel
    )
  }

  // Step4: Apply delta changes to order form
  let updatedOrderForm: OrderForm

  if (changes.length > 0) {
    // Update items first if there are changes
    updatedOrderForm = await commerce.checkout
      .updateOrderFormItems({
        id: orderForm.orderFormId,
        orderItems: changes,
        shouldSplitItem,
      })
      .then((form: OrderForm) =>
        updateOrderFormShippingData(form, session, ctx)
      )
  } else {
    // Only update shippingData if there are no item changes
    updatedOrderForm = await updateOrderFormShippingData(
      orderForm,
      session,
      ctx
    )
  }

  // Continue with marketingData, clientPreferencesData (locale), and etag updates.
  updatedOrderForm = await Promise.resolve(updatedOrderForm)
    // update marketingData
    .then((form: OrderForm) => {
      if (session?.marketingData) {
        const updatedMarketingData = {
          ...form.marketingData,
          ...session.marketingData,
        }

        return commerce.checkout.marketingData({
          id: orderForm.orderFormId,
          marketingData: updatedMarketingData,
        })
      }

      return form
    })

    // update session locale to orderForm clientPreferencesData when there are changes (same pattern as storePreferencesData)
    .then((form: OrderForm) => {
      if (locale && form.clientPreferencesData?.locale !== locale) {
        return commerce.checkout.clientPreferencesData({
          id: form.orderFormId,
          clientPreferencesData: {
            ...form.clientPreferencesData,
            locale,
          },
        })
      }
      return form
    })
    // update orderForm etag so we know last time we touched this orderForm
    .then((form: OrderForm) => setOrderFormEtag(form, commerce, sessionJwt))
    .then(joinItems)

  const equalMessages = deepEquals(
    orderForm.messages,
    updatedOrderForm.messages
  )

  // Step5: If no changes detected before/after updating orderForm, the order is validated
  if (equals(order, updatedOrderForm) && equalMessages) {
    return cartWhenSalesChannelAdoptedOrNull(
      updatedOrderForm,
      skuLoader,
      shouldSplitItem,
      adoptedSalesChannel
    )
  }

  // Step6: There were changes, convert orderForm to StoreCart
  return orderFormToCart(
    updatedOrderForm,
    skuLoader,
    shouldSplitItem,
    adoptedSalesChannel
  )
}
