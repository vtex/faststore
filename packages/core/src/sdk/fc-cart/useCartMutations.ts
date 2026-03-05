import { useCallback, useRef, useState } from 'react'

import { fcGraphQL } from './client'
import {
  CHANGE_QUANTITY_MUTATION,
  REMOVE_PRODUCT_MUTATION,
  REMOVE_PRODUCTS_MUTATION,
} from './queries'
import type {
  FCCartMutationPayload,
  FCCartUnion,
  FCSummary,
} from './types'

interface MutationCallbacks {
  setCart: (cart: FCCartUnion | null) => void
  setSummary: (summary: FCSummary | null) => void
  currentCart: FCCartUnion | null
}

interface UseCartMutationsReturn {
  changeQuantity: (itemIndex: number, quantity: number) => Promise<void>
  removeItem: (itemIndex: number) => Promise<void>
  removeUnavailableItems: (itemIndexes: number[]) => Promise<void>
  isMutating: boolean
  mutationError: string | null
}

export function useCartMutations(
  callbacks: MutationCallbacks
): UseCartMutationsReturn {
  const [isMutating, setIsMutating] = useState(false)
  const [mutationError, setMutationError] = useState<string | null>(null)
  const rollbackRef = useRef<FCCartUnion | null>(null)

  const applyMutationResult = useCallback(
    (payload: FCCartMutationPayload) => {
      if (payload.errors.length > 0) {
        const msg = payload.errors.map((e) => e.message).join('; ')

        setMutationError(msg)
        if (rollbackRef.current) {
          callbacks.setCart(rollbackRef.current)
        }

        return
      }

      if (payload.cart) {
        callbacks.setCart(payload.cart)
      }

      if (payload.summary) {
        callbacks.setSummary(payload.summary)
      }
    },
    [callbacks]
  )

  const changeQuantity = useCallback(
    async (itemIndex: number, quantity: number) => {
      if (isMutating) return

      setIsMutating(true)
      setMutationError(null)
      rollbackRef.current = callbacks.currentCart

      // Optimistic update: adjust quantity in local state immediately
      if (callbacks.currentCart?.__typename === 'Cart') {
        const optimistic = {
          ...callbacks.currentCart,
          availableItems: callbacks.currentCart.availableItems.map((item) =>
            item.originalIndex === itemIndex ? { ...item, quantity } : item
          ),
        }

        callbacks.setCart(optimistic)
      }

      try {
        const data = await fcGraphQL<{
          changeProductQuantity: FCCartMutationPayload
        }>(CHANGE_QUANTITY_MUTATION, {
          itemIndex,
          quantity,
          userIsoDate: new Date().toISOString(),
        })

        applyMutationResult(data.changeProductQuantity)
      } catch (err) {
        setMutationError(
          err instanceof Error ? err.message : 'Failed to update quantity'
        )
        if (rollbackRef.current) {
          callbacks.setCart(rollbackRef.current)
        }
      } finally {
        setIsMutating(false)
      }
    },
    [isMutating, callbacks, applyMutationResult]
  )

  const removeItem = useCallback(
    async (itemIndex: number) => {
      if (isMutating) return

      setIsMutating(true)
      setMutationError(null)
      rollbackRef.current = callbacks.currentCart

      // Optimistic update: remove from list immediately
      if (callbacks.currentCart?.__typename === 'Cart') {
        const optimistic = {
          ...callbacks.currentCart,
          availableItems: callbacks.currentCart.availableItems.filter(
            (item) => item.originalIndex !== itemIndex
          ),
          totalItems: callbacks.currentCart.totalItems - 1,
        }

        callbacks.setCart(optimistic)
      }

      try {
        const data = await fcGraphQL<{
          removeProduct: FCCartMutationPayload
        }>(REMOVE_PRODUCT_MUTATION, {
          input: { itemIndex, userIsoDate: new Date().toISOString() },
        })

        applyMutationResult(data.removeProduct)
      } catch (err) {
        setMutationError(
          err instanceof Error ? err.message : 'Failed to remove item'
        )
        if (rollbackRef.current) {
          callbacks.setCart(rollbackRef.current)
        }
      } finally {
        setIsMutating(false)
      }
    },
    [isMutating, callbacks, applyMutationResult]
  )

  const removeUnavailableItems = useCallback(
    async (itemIndexes: number[]) => {
      if (isMutating || itemIndexes.length === 0) return

      setIsMutating(true)
      setMutationError(null)
      rollbackRef.current = callbacks.currentCart

      // Optimistic update: clear unavailable list
      if (callbacks.currentCart?.__typename === 'Cart') {
        const optimistic = {
          ...callbacks.currentCart,
          unavailableItems:
            callbacks.currentCart.unavailableItems.filter(
              (item) => !itemIndexes.includes(item.originalIndex)
            ),
        }

        callbacks.setCart(optimistic)
      }

      try {
        const data = await fcGraphQL<{
          removeProducts: FCCartMutationPayload
        }>(REMOVE_PRODUCTS_MUTATION, {
          input: { itemsIndexes: itemIndexes, userIsoDate: new Date().toISOString() },
        })

        applyMutationResult(data.removeProducts)
      } catch (err) {
        setMutationError(
          err instanceof Error ? err.message : 'Failed to remove items'
        )
        if (rollbackRef.current) {
          callbacks.setCart(rollbackRef.current)
        }
      } finally {
        setIsMutating(false)
      }
    },
    [isMutating, callbacks, applyMutationResult]
  )

  return {
    changeQuantity,
    removeItem,
    removeUnavailableItems,
    isMutating,
    mutationError,
  }
}
