import { useCallback, useRef, useState } from 'react'

const UNDO_TIMEOUT_MS = 8000

interface RemovedItemData {
  quantity: number
  id: string
  seller: string
  name: string
}

interface UseUndoRemoveReturn {
  removedItem: RemovedItemData | null
  isUndoVisible: boolean
  triggerRemove: (
    itemIndex: number,
    itemData: RemovedItemData | null
  ) => void
  undo: () => void
  dismiss: () => void
}

export function useUndoRemove(
  removeItemFn: (itemIndex: number) => Promise<void>,
  revalidate: () => void
): UseUndoRemoveReturn {
  const [removedItem, setRemovedItem] = useState<RemovedItemData | null>(null)
  const [isUndoVisible, setIsUndoVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const itemIndexRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const dismiss = useCallback(() => {
    clearTimer()
    setRemovedItem(null)
    setIsUndoVisible(false)
    itemIndexRef.current = null
  }, [clearTimer])

  const triggerRemove = useCallback(
    async (itemIndex: number, itemData: RemovedItemData | null) => {
      // Clear any existing undo toast
      dismiss()

      try {
        await removeItemFn(itemIndex)

        if (itemData) {
          setRemovedItem(itemData)
          setIsUndoVisible(true)
          itemIndexRef.current = itemIndex

          timerRef.current = setTimeout(() => {
            setRemovedItem(null)
            setIsUndoVisible(false)
            itemIndexRef.current = null
          }, UNDO_TIMEOUT_MS)
        }
      } catch {
        // Error is handled by useCartMutations (rollback + error state)
      }
    },
    [removeItemFn, dismiss]
  )

  const undo = useCallback(async () => {
    if (!removedItem) return

    clearTimer()
    setIsUndoVisible(false)

    const { quantity, id, seller } = removedItem

    setRemovedItem(null)

    try {
      const { fcBffRequest } = await import('./client')
      const { ADD_PRODUCT } = await import('./mutations')

      const result = await fcBffRequest<{
        addProduct: { cart: unknown; errors: Array<{ message: string }> | null }
      }>(ADD_PRODUCT, {
        quantity,
        id,
        seller,
        userIsoDate: new Date().toISOString(),
      })

      if (result.addProduct.errors?.length) {
        throw new Error(result.addProduct.errors[0].message)
      }

      revalidate()
    } catch {
      revalidate()
    }
  }, [removedItem, clearTimer, revalidate])

  return {
    removedItem,
    isUndoVisible,
    triggerRemove,
    undo,
    dismiss,
  }
}
