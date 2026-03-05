import { useCallback, useRef, useState } from 'react'

import { fcBffRequest } from './client'
import {
  CHANGE_PRODUCT_QUANTITY,
  REMOVE_PRODUCT,
  REMOVE_PRODUCTS,
  ADD_PRODUCT,
} from './mutations'
import { sendCartAnalyticsEvent } from './analytics'
import {
  getSellingPrice,
  getListPrice,
} from './types'
import type {
  CartUnion,
  CartMutationResponse,
  FCCart,
  FCCartItem,
  ItemMutationState,
} from './types'

function getUserIsoDate(): string {
  return new Date().toISOString()
}

interface UseCartMutationsReturn {
  changeQuantity: (itemIndex: number, newQty: number) => void
  removeItem: (itemIndex: number) => Promise<void>
  addItem: (quantity: number, id: string, seller: string) => Promise<void>
  removeProducts: (itemIndexes: number[]) => Promise<void>
  itemStates: Map<number, ItemMutationState>
}

export function useCartMutations(
  data: CartUnion | null,
  setOptimisticData: (
    updater: (prev: CartUnion | null) => CartUnion | null
  ) => void,
  revalidate: () => void,
  currencyCode = 'USD'
): UseCartMutationsReturn {
  const [itemStates, setItemStates] = useState<Map<number, ItemMutationState>>(
    new Map()
  )

  const abortControllers = useRef<Map<number, AbortController>>(new Map())
  const debounceTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const setItemState = useCallback(
    (itemIndex: number, state: ItemMutationState) => {
      setItemStates((prev) => {
        const next = new Map(prev)

        if (state === 'idle') {
          next.delete(itemIndex)
        } else {
          next.set(itemIndex, state)
        }

        return next
      })
    },
    []
  )

  const applyCartResponse = useCallback(
    (response: CartMutationResponse) => {
      if (response.errors?.length) {
        throw new Error(response.errors.map((e) => e.message).join('; '))
      }

      setOptimisticData(() => response.cart)
    },
    [setOptimisticData]
  )

  const findItem = useCallback(
    (itemIndex: number): FCCartItem | undefined => {
      if (!data || data.__typename !== 'Cart') return undefined

      return (data as FCCart).availableItems.find(
        (i) => i.originalIndex === itemIndex
      )
    },
    [data]
  )

  const changeQuantity = useCallback(
    (itemIndex: number, newQty: number) => {
      const existing = debounceTimers.current.get(itemIndex)

      if (existing) {
        clearTimeout(existing)
      }

      const currentItem = findItem(itemIndex)
      const prevQty = currentItem?.quantity ?? 0

      // Optimistic update
      setOptimisticData((prev) => {
        if (!prev || prev.__typename !== 'Cart') return prev

        const cart = prev as FCCart

        return {
          ...cart,
          availableItems: cart.availableItems.map((item) =>
            item.originalIndex === itemIndex
              ? { ...item, quantity: newQty }
              : item
          ),
        }
      })

      setItemState(itemIndex, 'updating')

      const timer = setTimeout(async () => {
        const prevController = abortControllers.current.get(itemIndex)

        if (prevController) {
          prevController.abort()
        }

        const controller = new AbortController()

        abortControllers.current.set(itemIndex, controller)

        try {
          const result = await fcBffRequest<{
            changeProductQuantity: CartMutationResponse
          }>(
            CHANGE_PRODUCT_QUANTITY,
            { itemIndex, quantity: newQty, userIsoDate: getUserIsoDate() },
            controller.signal
          )

          applyCartResponse(result.changeProductQuantity)
          setItemState(itemIndex, 'idle')

          if (currentItem) {
            sendCartAnalyticsEvent(
              {
                productId: currentItem.productId,
                itemId: currentItem.itemId,
                name: currentItem.name,
                sellingPrice: getSellingPrice(currentItem.price),
                listPrice: getListPrice(currentItem.price),
                sellerId: currentItem.seller.id,
              },
              newQty - prevQty,
              currencyCode
            )
          }
        } catch (err) {
          if ((err as Error).name === 'AbortError') return

          revalidate()
          setItemState(itemIndex, 'error')
          setTimeout(() => setItemState(itemIndex, 'idle'), 3000)
        } finally {
          abortControllers.current.delete(itemIndex)
        }
      }, 300)

      debounceTimers.current.set(itemIndex, timer)
    },
    [setOptimisticData, setItemState, applyCartResponse, revalidate, findItem, currencyCode]
  )

  const removeItem = useCallback(
    async (itemIndex: number) => {
      const currentItem = findItem(itemIndex)

      setItemState(itemIndex, 'removing')

      try {
        const result = await fcBffRequest<{
          removeProduct: CartMutationResponse
        }>(REMOVE_PRODUCT, {
          input: { itemIndex, userIsoDate: getUserIsoDate() },
        })

        applyCartResponse(result.removeProduct)
        setItemState(itemIndex, 'idle')

        if (currentItem) {
          sendCartAnalyticsEvent(
            {
              productId: currentItem.productId,
              itemId: currentItem.itemId,
              name: currentItem.name,
              sellingPrice: getSellingPrice(currentItem.price),
              listPrice: getListPrice(currentItem.price),
              sellerId: currentItem.seller.id,
            },
            -currentItem.quantity,
            currencyCode
          )
        }
      } catch {
        revalidate()
        setItemState(itemIndex, 'error')
        setTimeout(() => setItemState(itemIndex, 'idle'), 3000)
        throw new Error('Failed to remove item')
      }
    },
    [setItemState, applyCartResponse, revalidate, findItem, currencyCode]
  )

  const addItem = useCallback(
    async (quantity: number, id: string, seller: string) => {
      try {
        const result = await fcBffRequest<{
          addProduct: CartMutationResponse
        }>(ADD_PRODUCT, {
          quantity,
          id,
          seller,
          userIsoDate: getUserIsoDate(),
        })

        applyCartResponse(result.addProduct)
      } catch {
        revalidate()
        throw new Error('Failed to add item')
      }
    },
    [applyCartResponse, revalidate]
  )

  const removeProducts = useCallback(
    async (itemIndexes: number[]) => {
      for (const idx of itemIndexes) {
        setItemState(idx, 'removing')
      }

      try {
        const result = await fcBffRequest<{
          removeProducts: CartMutationResponse
        }>(REMOVE_PRODUCTS, {
          input: { itemsIndexes: itemIndexes, userIsoDate: getUserIsoDate() },
        })

        applyCartResponse(result.removeProducts)

        for (const idx of itemIndexes) {
          setItemState(idx, 'idle')
        }
      } catch {
        revalidate()

        for (const idx of itemIndexes) {
          setItemState(idx, 'error')
          setTimeout(() => setItemState(idx, 'idle'), 3000)
        }
      }
    },
    [setItemState, applyCartResponse, revalidate]
  )

  return {
    changeQuantity,
    removeItem,
    addItem,
    removeProducts,
    itemStates,
  }
}
