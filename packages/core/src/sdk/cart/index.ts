import { gql } from '@faststore/graphql-utils'
import type { Cart as SDKCart, CartItem as SDKCartItem } from '@faststore/sdk'
import { createCartStore } from '@faststore/sdk'
import { useMemo } from 'react'

import type {
  CartItemFragment,
  CartMessageFragment,
  IStoreOffer,
  ValidateCartMutationMutation,
  ValidateCartMutationMutationVariables,
} from '@generated/graphql'

import storeConfig from '../../../faststore.config'
import { request } from '../graphql/request'
import { sessionStore } from '../session'
import { createValidationStore, useStore } from '../useStore'

export interface CartItem extends SDKCartItem, CartItemFragment {}

export interface Cart extends SDKCart<CartItem> {
  messages?: CartMessageFragment[]
  shouldSplitItem?: boolean
}

export const ValidateCartMutation = gql`
  mutation ValidateCartMutation($cart: IStoreCart!, $session: IStoreSession!) {
    validateCart(cart: $cart, session: $session) {
      order {
        orderNumber
        acceptedOffer {
          ...CartItem
        }
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
    listPrice
    itemOffered {
      ...CartProductItem
    }
  }

  fragment CartProductItem on StoreProduct {
    sku
    name
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
`

const isGift = (item: CartItem) => item.price === 0

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
          }): IStoreOffer => ({
            price,
            listPrice,
            seller,
            quantity,
            itemOffered: {
              sku: itemOffered.sku,
              image: itemOffered.image,
              name: itemOffered.name,
              additionalProperty: itemOffered.additionalProperty,
            },
          })
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

export const useCart = () => {
  const cart = useStore(cartStore)
  const isValidating = useStore(validationStore)

  return useMemo(
    () => ({
      ...cart,
      isValidating,
      messages: cart.messages,
      gifts: cart.items.filter((item) => isGift(item)),
      items: cart.items.filter((item) => !isGift(item)),
      totalUniqueItems: cart.items.length,
      totalItems: cart.items.reduce(
        (acc, curr) => acc + (isGift(curr) ? 0 : curr.quantity),
        0
      ),
      total: cart.items.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0
      ),
      subTotal: cart.items.reduce(
        (acc, curr) => acc + curr.listPrice * curr.quantity,
        0
      ),
    }),
    [cart, isValidating]
  )
}
