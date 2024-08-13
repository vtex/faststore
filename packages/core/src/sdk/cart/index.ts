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

import storeConfig from '../../../faststore.config'
import { request } from '../graphql/request'
import { sessionStore } from '../session'
import { createValidationStore, useStore } from '../useStore'

export interface CartItem extends SDKCartItem, CartItemFragment {}

export interface Cart extends SDKCart<CartItem> {
  messages?: CartMessageFragment[]
  shouldSplitItem?: boolean
  forceNewCart?: boolean
}

export const ValidateCartMutation = gql(`
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
    priceWithTaxes
    listPrice
    listPriceWithTaxes
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

type Order = {
  orderFormId: string
  orderIsComplete: boolean
}

type Orders = {
  list: Order[]
}

const validateCart = async (cart: Cart): Promise<Cart | null> => {
  let shouldForceNewCart = false
  const response = await fetch(
    'https://storeframework.vtexcommercestable.com.br/api/oms/pvt/orders?orderBy=creationDate,desc&per_page=5',
    {
      // mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        VtexIdclientAutCookie:
          'eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ3NjYwNjE2Mjc3NzFBQ0FFQTdCN0ZBOUM5MzAyNUFENzhFNzQwNjgiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJsdWNhcy5wb3J0ZWxhQHZ0ZXguY29tIiwiYWNjb3VudCI6InN0b3JlZnJhbWV3b3JrIiwiYXVkaWVuY2UiOiJhZG1pbiIsInNlc3MiOiI2MzBlMDE2Ny1iN2M3LTQwNmMtOWVjYi0wMzg3YTJjOGVlNTUiLCJleHAiOjE3MjM2NDI3MTUsInR5cGUiOiJ1c2VyIiwidXNlcklkIjoiODM2Zjk1ZmQtYzQ5MS00NzVkLTg3YTgtZjRiYTE1NGEyOGViIiwiaWF0IjoxNzIzNTU2MzE1LCJpc3MiOiJ0b2tlbi1lbWl0dGVyIiwianRpIjoiZGY5ZTEzM2YtNDI0Mi00OGJjLThiODgtMDJlYzI4MWY3NmU5In0.aqyKrj7bdL5CoNs7WMdKybOvUBfaSJxqIb4JreHsRzt3W76G95kNa-sdAt7s2AJ5WNUTMttM4Qs9TiVBEOoj4w',
      },
    }
  )
  console.log('responseeeeee', response)

  if (response.ok) {
    const orders = (await response.json()) as Orders
    const placedOrder = orders.list.find(
      ({ orderFormId }) => orderFormId === cart.id
    )

    if (placedOrder.orderIsComplete) {
      shouldForceNewCart = true
    }
  }

  const { validateCart: validated = null } = await request<
    ValidateCartMutationMutation,
    ValidateCartMutationMutationVariables
  >(ValidateCartMutation, {
    session: sessionStore.read(),
    cart: {
      forceNewCart: shouldForceNewCart,
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
          }): IStoreOffer => {
            return {
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
