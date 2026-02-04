import { useState } from 'react'
import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'
import { cartStore, ValidateCartMutation } from '../cart'
import type {
  IStoreOffer,
  ValidateCartMutationMutation,
  ValidateCartMutationMutationVariables,
  CartItemFragment,
} from '@generated/graphql'
import { request } from '../graphql/request'
import { sessionStore } from '../session'
import { redirectToCheckout } from '../cart/redirectToCheckout'
import ReorderError from '../error/ReorderError/ReorderError'

type Order = ServerOrderDetailsQueryQuery['userOrder']
type AdditionalProperties =
  CartItemFragment['itemOffered']['additionalProperty']

const getItemId = (item: CartItemFragment) => {
  const propertyIds =
    item.itemOffered.additionalProperty
      ?.map((prop) => prop.propertyID)
      .join('-') ?? ''

  const sellerId = item.seller?.identifier ?? ''

  return [item.itemOffered.sku, sellerId, propertyIds]
    .filter(Boolean)
    .join('::')
}

export const useReorder = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const reorder = async (order: Order | null | undefined) => {
    if (!order) {
      const err = new ReorderError('Order not found')
      setError(err)
      return
    }

    const deliveryOptions = order.deliveryOptionsData?.deliveryOptions ?? []
    const orderItemsWithSeller =
      deliveryOptions.flatMap((option) =>
        (option?.items ?? []).map((item) => ({
          ...item,
          seller: option?.seller,
        }))
      ) ?? []

    if (!orderItemsWithSeller || orderItemsWithSeller.length === 0) {
      const err = new ReorderError('No items found in order')
      setError(err)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const currentCart = cartStore.read()
      const orderFormId = currentCart.id || ''

      const acceptedOffer: IStoreOffer[] = orderItemsWithSeller
        .filter(
          (item) =>
            item && item.id && item.quantity && item.seller && item.quantity > 0
        )
        .map((item) => ({
          quantity: item.quantity,
          seller: {
            identifier: item.seller,
          },
          price: item.price ?? 0,
          listPrice: item.price ?? 0,
          itemOffered: {
            sku: item.id ?? '',
            image: item.imageUrl
              ? [
                  {
                    url: item.imageUrl,
                    alternateName: item.name ?? '',
                  },
                ]
              : [],
            name: item.name ?? '',
            additionalProperty: [] as AdditionalProperties,
          },
        }))

      if (acceptedOffer.length === 0) {
        throw new ReorderError('No valid items to reorder')
      }

      const { validateCart: validated } = await request<
        ValidateCartMutationMutation,
        ValidateCartMutationMutationVariables
      >(ValidateCartMutation, {
        session: sessionStore.read(),
        cart: {
          order: {
            orderNumber: orderFormId,
            shouldSplitItem: false,
            acceptedOffer,
          },
        },
      })

      if (!validated) {
        throw new ReorderError('Failed to add items to cart')
      }

      const updatedCart = {
        id: validated.order.orderNumber,
        items: validated.order.acceptedOffer.map((item) => ({
          ...item,
          id: getItemId(item),
        })),
        messages: validated.messages,
        shouldSplitItem: validated.order.shouldSplitItem,
      }

      cartStore.set(updatedCart)

      redirectToCheckout(validated.order.orderNumber)
    } catch (err) {
      setError(err instanceof Error ? err : new ReorderError('Unknown error'))
      console.error('Error reordering:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    reorder,
    loading,
    error,
  }
}
