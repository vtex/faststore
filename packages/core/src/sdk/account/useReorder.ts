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

type Order = ServerOrderDetailsQueryQuery['userOrder']

// Função helper para gerar ID do item (similar à getItemId do cart)
const getItemId = (item: CartItemFragment) => {
  const propertyIds =
    item.itemOffered.additionalProperty
      ?.map((prop) => prop.propertyID)
      .join('-') || ''

  return [item.itemOffered.sku, item.seller.identifier, propertyIds]
    .filter(Boolean)
    .join('::')
}

export const useReorder = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const reorder = async (order: Order | null | undefined) => {
    if (!order) {
      setError(new Error('Order not found'))
      return
    }

    // Extrair todos os itens das deliveryOptions e agrupar por seller
    // Os itens em deliveryOptions são simplificados, então precisamos usar
    // as informações da deliveryOption (seller) junto com os itens
    const orderItemsWithSeller =
      order.deliveryOptionsData.deliveryOptions.flatMap((option) =>
        (option.items || []).map((item) => ({
          ...item,
          seller: option.seller,
        }))
      )

    if (!orderItemsWithSeller || orderItemsWithSeller.length === 0) {
      setError(new Error('No items found in order'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      // NÃO esvaziar o carrinho - deixar o validateCart fazer a sincronização
      // O validateCart vai substituir todos os itens do OrderForm pelos novos itens do pedido

      // Obter orderFormId atual (do cookie ou do cart)
      const currentCart = cartStore.read()
      const orderFormId = currentCart.id || ''

      // Converter itens do pedido para formato IStoreOffer
      const acceptedOffer: IStoreOffer[] = orderItemsWithSeller
        .filter(
          (item) =>
            item && item.id && item.quantity && item.seller && item.quantity > 0
        )
        .map((item) => ({
          quantity: item.quantity ?? 1,
          seller: {
            identifier: item.seller ?? '',
          },
          price: item.price ?? 0,
          listPrice: item.price ?? 0, // deliveryOptionsItems não tem listPrice
          itemOffered: {
            sku: item.id ?? '',
            // Campos mínimos necessários - o checkout buscará o resto automaticamente
            image: item.imageUrl
              ? [
                  {
                    url: item.imageUrl,
                    alternateName: item.name ?? '',
                  },
                ]
              : [],
            name: item.name ?? '',
            // deliveryOptionsItems não tem attachments, então deixamos undefined
            additionalProperty: undefined as
              | Array<{
                  propertyID: string
                  name: string
                  value: any
                  valueReference: string
                }>
              | undefined,
          },
        }))

      if (acceptedOffer.length === 0) {
        throw new Error('No valid items to reorder')
      }

      // Chamar mutation validateCart para adicionar itens ao checkout
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
        throw new Error('Failed to add items to cart')
      }

      // Atualizar o cartStore com os itens retornados do checkout
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

      // Redirecionar para o checkout após adicionar os itens
      redirectToCheckout(validated.order.orderNumber)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
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
