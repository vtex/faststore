import { useCallback } from 'react'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import type { PixelItem } from '../pixel/events'

export interface UpdateQuantityWithPixelParams<T, R> {
  updateQuantity: (item: T) => R
}

export type UpdateQuantityWithPixel<T, R> = <P extends MinimalOrderFormItem>(
  item: P & T,
  oldItem?: P
) => R

export interface UseUpdateQuantityWithPixel<T, R> {
  updateQuantityWithPixel: UpdateQuantityWithPixel<T, R>
}

export interface MinimalOrderFormItem {
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
  orderFormItem: MinimalOrderFormItem
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

export function updateQuantityWithPixel<T, R>({
  updateQuantity,
}: UpdateQuantityWithPixelParams<T, R>): UpdateQuantityWithPixel<T, R> {
  return (updatedItem, oldItem) => {
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

export function useUpdateQuantityWithPixel<T, R>({
  updateQuantity,
}: UpdateQuantityWithPixelParams<T, R>): UseUpdateQuantityWithPixel<T, R> {
  const updateQuantityWithPixelCallback = useCallback(
    (updatedItem, oldItem) =>
      updateQuantityWithPixel({ updateQuantity })(updatedItem, oldItem),
    [updateQuantity]
  )

  return { updateQuantityWithPixel: updateQuantityWithPixelCallback }
}
