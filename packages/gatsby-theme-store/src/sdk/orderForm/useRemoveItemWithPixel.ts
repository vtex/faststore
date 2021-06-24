import { useCallback } from 'react'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import type { MinimalOrderFormItem } from './useUpdateQuantityWithPixel'
import { orderFormItemToPixelItem } from './useUpdateQuantityWithPixel'

export type RemoveItemWithPixel<T, R> = <P extends MinimalOrderFormItem>(
  item: P & T
) => R

export interface UseRemoveItemWithPixel<T, R> {
  removeItemWithPixel: RemoveItemWithPixel<T, R>
}

export interface RemoveItemWithPixelParams<T, R> {
  removeItem: (item: T) => R
}

export function removeItemWithPixel<T, R>({
  removeItem,
}: RemoveItemWithPixelParams<T, R>): RemoveItemWithPixel<T, R> {
  return (item): R => {
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

export function useRemoveItemWithPixel<T, R>({
  removeItem,
}: RemoveItemWithPixelParams<T, R>): UseRemoveItemWithPixel<T, R> {
  const removeItemWithPixelCallback = useCallback(
    (item) => removeItemWithPixel({ removeItem })(item),
    [removeItem]
  )

  return { removeItemWithPixel: removeItemWithPixelCallback }
}
