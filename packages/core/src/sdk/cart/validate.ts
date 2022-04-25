import { gql } from '@vtex/graphql-utils'
import type { CartItem as SDKCartItem, Cart as SDKCart } from '@faststore/sdk'
import type { IStoreOffer } from '@faststore/api'

import type {
  ValidateCartMutationMutation,
  ValidateCartMutationMutationVariables,
  CartItemFragment,
  CartMessageFragment,
} from '@generated/graphql'

import { request } from '../graphql/request'

export interface CartItem extends SDKCartItem, CartItemFragment {}

export interface Cart extends SDKCart<CartItem> {
  messages?: CartMessageFragment[]
}

export const ValidateCartMutation = gql`
  mutation ValidateCartMutation($cart: IStoreCart!) {
    validateCart(cart: $cart) {
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
      }
      gtin
    }
  }
`

export const isGift = (item: CartItem) => item.price === 0

export const getItemId = (
  item: Pick<CartItem, 'itemOffered' | 'seller' | 'price'>
) => `${item.itemOffered.sku}:${item.seller.identifier}:${item.price}`

export const validateCart = async (cart: Cart): Promise<Cart | null> => {
  const { validateCart: validated = null } = await request<
    ValidateCartMutationMutation,
    ValidateCartMutationMutationVariables
  >(ValidateCartMutation, {
    cart: {
      order: {
        orderNumber: cart.id,
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
