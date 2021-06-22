import { useCallback } from 'react'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import type { PixelItem } from '../pixel/events'

export interface UpdateQuantityWithAnalyticsParams<K, S> {
  updateQuantity: (item: K) => S
}

export interface OrderFormItemToAnalytics {
  productId: string
  productRefId: string
  /* Product Name */
  name: string
  /* Price as integer */
  price: number
  quantity: number
  /* SKU Id */
  id: string
  /* SKU Reference Id */
  refId: string
  skuName: string
  additionalInfo: Maybe<{
    brandName?: Maybe<string>
  }>
  productCategories: Record<number, string>
}

export function orderFormItemToPixelItem(
  orderFormItem: OrderFormItemToAnalytics
): PixelItem {
  return {
    productId: orderFormItem.productId,
    productReferenceId: orderFormItem.productRefId,
    productName: orderFormItem.name,
    brand: orderFormItem.additionalInfo?.brandName,
    categoryTree: Object.values(orderFormItem.productCategories).map(
      (categoryName: string) => ({
        name: categoryName,
      })
    ),
    price: orderFormItem.price / 100,
    // TODO currencyCode,
    quantity: orderFormItem.quantity,
    skuId: orderFormItem.id,
    skuReferenceId: [{ value: orderFormItem.refId }],
    skuName: orderFormItem.skuName,
  } as PixelItem
}

export function updateQuantityWithAnalytics<
  T extends OrderFormItemToAnalytics,
  K,
  S
>({ updateQuantity }: UpdateQuantityWithAnalyticsParams<K, S>) {
  return (updatedItem: T & K, oldItem?: T) => {
    const updateQuantityResult = updateQuantity(updatedItem)

    if (!oldItem) {
      return updateQuantityResult
    }

    const quantityDelta = updatedItem.quantity - oldItem.quantity

    if (quantityDelta === 0) {
      return updateQuantityResult
    }

    const pixelEventItem = orderFormItemToPixelItem({
      ...updatedItem,
      quantity: Math.abs(quantityDelta),
    })

    sendPixelEvent({
      type: quantityDelta > 0 ? 'vtex:addToCart' : 'vtex:removeFromCart',
      data: {
        items: [pixelEventItem],
      },
    })

    return updateQuantityResult
  }
}

export function useUpdateQuantityAnalytics<
  T extends OrderFormItemToAnalytics,
  K,
  S
>({ updateQuantity }: UpdateQuantityWithAnalyticsParams<K, S>) {
  const updateQuantityWithAnalyticsCallback = useCallback(
    (updatedItem: T & K, oldItem?: T) =>
      updateQuantityWithAnalytics({ updateQuantity })(updatedItem, oldItem),
    [updateQuantity]
  )

  return { updateQuantityWithAnalytics: updateQuantityWithAnalyticsCallback }
}
