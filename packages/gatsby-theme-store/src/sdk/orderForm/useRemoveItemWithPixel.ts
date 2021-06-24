import { useCallback } from 'react'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import type { MinimalOrderFormItem } from './useUpdateQuantityWithPixel'
import { orderFormItemToPixelItem } from './useUpdateQuantityWithPixel'

export interface RemoveItemWithPixelParams<K, S> {
  removeItem: (item: K) => S
}

export function removeItemWithPixel<T extends MinimalOrderFormItem, K, S>({
  removeItem,
}: RemoveItemWithPixelParams<K, S>) {
  return (item: T & K): S => {
    const removeItemResult = removeItem(item)

    const pixelEventItem = orderFormItemToPixelItem(item)

    sendPixelEvent({
      type: 'vtex:removeFromCart',
      data: {
        items: [pixelEventItem],
      },
    })

    return removeItemResult
  }
}

export function useRemoveItemWithPixel<T extends MinimalOrderFormItem, K, S>({
  removeItem,
}: RemoveItemWithPixelParams<K, S>) {
  const removeItemWithPixelCallback = useCallback(
    (item: T & K) => removeItemWithPixel({ removeItem })(item),
    [removeItem]
  )

  return { removeItemWithPixel: removeItemWithPixelCallback }
}
