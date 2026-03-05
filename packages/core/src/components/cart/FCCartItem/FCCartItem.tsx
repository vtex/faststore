import {
  CartItem as UICartItem,
  CartItemImage as UICartItemImage,
  CartItemSummary as UICartItemSummary,
} from '@faststore/ui'
import { useCallback } from 'react'

import { Image } from 'src/components/ui/Image'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type { FCCartProduct } from 'src/sdk/fc-cart/types'
import { hasPriceDiscount } from 'src/sdk/fc-cart/types'

interface FCCartItemProps {
  item: FCCartProduct
  onQuantityChange: (itemIndex: number, quantity: number) => void
  onRemove: (itemIndex: number) => void
  isMutating: boolean
}

function getDisplayPrice(price: FCCartProduct['price']): number {
  if (hasPriceDiscount(price)) {
    return price.valueWithDiscount.asNumber
  }

  return price.value.asNumber
}

function getListPrice(price: FCCartProduct['price']): number {
  if (hasPriceDiscount(price)) {
    return price.value.asNumber
  }

  return price.value.asNumber
}

function FCCartItem({
  item,
  onQuantityChange,
  onRemove,
  isMutating,
}: FCCartItemProps) {
  const handleQuantityChange = useCallback(
    (quantity: number) => {
      onQuantityChange(item.originalIndex, quantity)
    },
    [item.originalIndex, onQuantityChange]
  )

  const handleRemove = useCallback(() => {
    onRemove(item.originalIndex)
  }, [item.originalIndex, onRemove])

  const sellingPrice = getDisplayPrice(item.price)
  const listPrice = getListPrice(item.price)

  return (
    <UICartItem
      price={{
        value: sellingPrice,
        listPrice,
        formatter: useFormattedPrice,
      }}
      quantity={item.quantity}
      onQuantityChange={handleQuantityChange}
      removeBtnProps={{
        onClick: handleRemove,
        disabled: isMutating,
        'aria-label': `Remove ${item.name} from cart`,
      }}
      data-sku={item.itemId}
      data-seller={item.seller.id}
    >
      <UICartItemImage>
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={48}
          height={48}
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        />
      </UICartItemImage>
      <UICartItemSummary title={item.name} />
    </UICartItem>
  )
}

export default FCCartItem
