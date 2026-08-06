import type { Cart as SDKCart, CartItem as SDKCartItem } from '@faststore/sdk'
import { createCartStore } from '@faststore/sdk'
import { useMemo } from 'react'

import { gql } from '@generated'
import type {
  CartItemFragment,
  CartMessageFragment,
  IStoreOffer,
  ValidateCartMutationMutation,
  ValidateCartMutationMutationVariables,
} from '@generated/graphql'

import storeConfig from '../../../discovery.config'
import { request } from '../graphql/request'
import { hasValidatedSessionStore, sessionStore } from '../session'
import { createValidationStore, useStore } from '../useStore'

export interface CartItem
  extends SDKCartItem,
    Omit<CartItemFragment, 'isGift' | 'priceToken'> {
  isGift?: boolean | null
  priceToken?: string | null
}

export interface Cart extends SDKCart<CartItem> {
  messages?: CartMessageFragment[]
  shouldSplitItem?: boolean
}

/** Max time to wait for the first validateSession before validating the cart. */
const SESSION_VALIDATION_WAIT_MS = 3_000

/**
 * Defers cart validation until session has been validated at least once, so
 * `session.channel` (sales channel) is less likely to be stale relative to
 * Session Manager / external flows like Quick Order.
 */
const waitForSessionValidated = async (): Promise<void> => {
  if (hasValidatedSessionStore.read()) {
    return
  }

  await new Promise<void>((resolve) => {
    const timeoutId = setTimeout(() => {
      unsubscribe()
      resolve()
    }, SESSION_VALIDATION_WAIT_MS)

    const unsubscribe = hasValidatedSessionStore.subscribe((validated) => {
      if (!validated) {
        return
      }

      clearTimeout(timeoutId)
      unsubscribe()
      resolve()
    })

    // Race: validation may have finished between read() and subscribe()
    if (hasValidatedSessionStore.read()) {
      clearTimeout(timeoutId)
      unsubscribe()
      resolve()
    }
  })
}

export const ValidateCartMutation = gql(`
  mutation ValidateCartMutation($cart: IStoreCart!, $session: IStoreSession!) {
    validateCart(cart: $cart, session: $session) {
      order {
        orderNumber
        acceptedOffer {
          ...CartItem
        }
        shouldSplitItem
      }
      messages {
        ...CartMessage
      }
    }
  }

  fragment CartMessage on StoreCartMessage {
    text
    status
  }

  fragment CartItem on StoreOffer {
    seller {
      identifier
    }
    quantity
    price
    priceWithTaxes
    listPrice
    listPriceWithTaxes
    isGift
    priceToken
    itemOffered {
      ...CartProductItem
    }
  }

  fragment CartProductItem on StoreProduct {
    sku
    name
    unitMultiplier
    image {
      url
      alternateName
    }
    brand {
      name
    }
    isVariantOf {
      productGroupID
      name
      skuVariants {
        activeVariations
        slugsMap
        availableVariations
      }
    }
    gtin
    additionalProperty {
      propertyID
      name
      value
      valueReference
    }
  }
`)

const isGift = (item: CartItem) => {
  if (storeConfig.experimental?.useIsGiftFromOrderForm) {
    return item?.isGift ?? false
  }
  return item.price === 0
}

const getItemId = (item: Pick<CartItem, 'itemOffered' | 'seller' | 'price'>) =>
  [
    item.itemOffered.sku,
    item.seller.identifier,
    item.itemOffered.additionalProperty
      ?.map(({ propertyID }) => propertyID)
      .join('-'),
  ]
    .filter(Boolean)
    .join('::')

const validateCart = async (cart: Cart): Promise<Cart | null> => {
  await waitForSessionValidated()

  const { validateCart: validated = null } = await request<
    ValidateCartMutationMutation,
    ValidateCartMutationMutationVariables
  >(ValidateCartMutation, {
    session: sessionStore.read(),
    cart: {
      order: {
        orderNumber: cart.id,
        shouldSplitItem: cart.shouldSplitItem,
        acceptedOffer: cart.items.map(
          ({
            price,
            listPrice,
            seller,
            quantity,
            itemOffered,
            priceToken,
          }): IStoreOffer => {
            return {
              price,
              listPrice,
              seller,
              quantity,
              priceToken,
              itemOffered: {
                sku: itemOffered.sku,
                image: itemOffered.image,
                name: itemOffered.name,
                additionalProperty: itemOffered.additionalProperty,
              },
            }
          }
        ),
      },
    },
  })

  return (
    validated && {
      id: validated.order.orderNumber,
      items: validated.order.acceptedOffer.map((item) => ({
        ...item,
        id: getItemId(item),
      })),
      messages: validated.messages,
      shouldSplitItem: validated.order.shouldSplitItem,
    }
  )
}

const [validationStore, onValidate] = createValidationStore(validateCart)
const defaultCartStore = createCartStore<Cart>(storeConfig.cart, onValidate)

export const cartStore = {
  ...defaultCartStore,
  addItem: (item: Omit<CartItem, 'id'>) => {
    const cartItem = {
      ...item,
      id: getItemId(item),
    }

    defaultCartStore.addItem(cartItem)
  },
}

export const useCart = (
  { useUnitMultiplier } = { useUnitMultiplier: false }
) => {
  const cart = useStore(cartStore)
  const isValidating = useStore(validationStore)

  return useMemo(() => {
    const cartTotals = cart.items.reduce(
      (totals, curr) => {
        totals.total += curr.price * curr.quantity
        totals.totalWithTaxes += curr.priceWithTaxes * curr.quantity

        const quantityMultiplier = useUnitMultiplier
          ? curr.quantity * (curr?.itemOffered?.unitMultiplier ?? 1)
          : curr.quantity

        totals.totalItems += isGift(curr) ? 0 : quantityMultiplier
        totals.subTotal += curr.listPrice * quantityMultiplier
        totals.subTotalWithTaxes += curr.listPriceWithTaxes * quantityMultiplier

        return totals
      },
      {
        totalItems: 0,
        total: 0,
        subTotal: 0,
        totalWithTaxes: 0,
        subTotalWithTaxes: 0,
      }
    )

    return {
      ...cart,
      ...cartTotals,
      isValidating,
      messages: cart.messages,
      gifts: cart.items.filter((item) => isGift(item)),
      items: cart.items.filter((item) => !isGift(item)),
      totalUniqueItems: cart.items.length,
    }
  }, [cart, isValidating, useUnitMultiplier])
}
