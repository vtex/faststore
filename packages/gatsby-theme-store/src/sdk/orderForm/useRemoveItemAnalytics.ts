import { useCallback } from 'react'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import type { OrderFormItemToAnalytics } from './useUpdateQuantityAnalytics'
import { orderFormItemToPixelItem } from './useUpdateQuantityAnalytics'

export interface RemoveItemWithAnalyticsParams<K, S> {
  removeItem: (item: K) => S
}

export function removeItemWithAnalytics<
  T extends OrderFormItemToAnalytics,
  K,
  S
>({ removeItem }: RemoveItemWithAnalyticsParams<K, S>) {
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

export function useRemoveItemAnalytics<
  T extends OrderFormItemToAnalytics,
  K,
  S
>({ removeItem }: RemoveItemWithAnalyticsParams<K, S>) {
  const removeItemWithAnalyticsCallback = useCallback(
    (item: T & K) => removeItemWithAnalytics({ removeItem })(item),
    [removeItem]
  )

  return { removeItemWithAnalytics: removeItemWithAnalyticsCallback }
}
