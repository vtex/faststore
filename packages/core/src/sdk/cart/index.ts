import type { Cart as SDKCart, CartItem as SDKCartItem } from '@faststore/sdk'
import { createCartStore } from '@faststore/sdk'
import { useMemo } from 'react'

import { gql } from '@generated'
import type {
  CartItemFragment,
  CartMessageFragment,
  IStoreOffer,
  StoreCartAdditionalFragment,
  ValidateCartMutationMutation,
  ValidateCartMutationMutationVariables,
} from '@generated/graphql'

import storeConfig from '../../../discovery.config'
import { request } from '../graphql/request'
import { sessionStore } from '../session'
import { createValidationStore, useStore } from '../useStore'

export interface CartItem
  extends SDKCartItem,
    Omit<CartItemFragment, 'isGift' | 'priceToken'> {
  isGift?: boolean | null
  priceToken?: string | null
}

export type Cart = SDKCart<CartItem> &
  Partial<Omit<StoreCartAdditionalFragment, 'order'>> & {
    messages?: CartMessageFragment[]
    shouldSplitItem?: boolean
  }

export const ValidateCartMutation = gql(`
  mutation ValidateCartMutation($cart: IStoreCart!, $session: IStoreSession!) {
    validateCart(cart: $cart, session: $session) {
      ...StoreCartAdditional
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
    ...CartItemAdditional
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

type ValidatedCart = NonNullable<ValidateCartMutationMutation['validateCart']> &
  StoreCartAdditionalFragment

export const getCartFromValidatedCart = (
  validated: NonNullable<ValidateCartMutationMutation['validateCart']>
): Cart => {
  const { order, messages, ...customCartFields } = validated as ValidatedCart

  return {
    ...customCartFields,
    id: order.orderNumber,
    items: order.acceptedOffer.map((item) => ({
      ...item,
      id: getItemId(item),
    })),
    messages,
    shouldSplitItem: order.shouldSplitItem,
  }
}

export const validateCart = async (cart: Cart): Promise<Cart | null> => {
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

  return validated ? getCartFromValidatedCart(validated) : null
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
