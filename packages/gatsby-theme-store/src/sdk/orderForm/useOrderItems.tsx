import { useOrderItems as useRawOrderItems } from '@vtex/order-items'
import type {
  RemoveItemFn,
  UpdateQuantityFn,
} from '@vtex/order-items/types/modules/OrderItemsContext'

import type { RemoveItemWithPixel } from './useRemoveItemWithPixel'
import { useRemoveItemWithPixel } from './useRemoveItemWithPixel'
import type { UpdateQuantityWithPixel } from './useUpdateQuantityWithPixel'
import { useUpdateQuantityWithPixel } from './useUpdateQuantityWithPixel'

export interface UseOrderItemsWithPixel {
  updateQuantity: UpdateQuantityWithPixel<Parameters<UpdateQuantityFn>[0], void>
  removeItem: RemoveItemWithPixel<Parameters<RemoveItemFn>[0], void>
}

export type UseOrderItems = Omit<
  ReturnType<typeof useRawOrderItems>,
  'updateQuantity' | 'removeItem'
> &
  UseOrderItemsWithPixel

const nonBlockingWrapper = <T extends any[]>(fn: (...args: T) => any) => {
  return (...args: T): void => {
    fn(...args)
  }
}

export function useOrderItems(): UseOrderItems {
  const { updateQuantity, removeItem, ...rawOrderItems } = useRawOrderItems()
  const { updateQuantityWithPixel } = useUpdateQuantityWithPixel({
    updateQuantity,
  })

  const { removeItemWithPixel } = useRemoveItemWithPixel({ removeItem })

  return {
    ...rawOrderItems,
    updateQuantity: nonBlockingWrapper(updateQuantityWithPixel),
    removeItem: removeItemWithPixel,
  }
}
