import {
  CartItem as UICartItem,
  CartItemImage as UICartItemImage,
  CartItemSummary as UICartItemSummary,
} from '@faststore/ui'
import { useCallback } from 'react'

import { Image } from 'src/components/ui/Image'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useCartPage } from '../../context/CartPageContext'
import type {
  Product,
  PriceWithDiscount,
} from '../../context/types'

import styles from './CartPageItem.module.scss'

function getProductPrice(product: Product) {
  const { price } = product

  if (price.__typename === 'PriceWithDiscount') {
    const p = price as PriceWithDiscount
    return {
      value: p.valueWithDiscount.asNumber,
      listPrice: p.value.asNumber,
    }
  }

  return {
    value: price.value.asNumber,
    listPrice: price.value.asNumber,
  }
}

interface CartPageItemProps {
  item: Product
}

export default function CartPageItem({ item }: CartPageItemProps) {
  const { changeProductQuantity, removeProduct, mutating } = useCartPage()
  const { value, listPrice } = getProductPrice(item)

  const handleQuantityChange = useCallback(
    (quantity: number) => {
      changeProductQuantity(item.originalIndex, quantity)
    },
    [changeProductQuantity, item.originalIndex]
  )

  const handleRemove = useCallback(() => {
    removeProduct(item.originalIndex)
  }, [removeProduct, item.originalIndex])

  return (
    <UICartItem
      className={styles.cartPageItem}
      price={{
        value,
        listPrice,
        formatter: useFormattedPrice,
      }}
      quantity={item.quantity}
      onQuantityChange={handleQuantityChange}
      removeBtnProps={{
        onClick: handleRemove,
        disabled: mutating,
        'aria-label': `Remove ${item.name} from cart`,
      }}
      data-sku={item.itemId}
      data-seller={item.seller.id}
    >
      <UICartItemImage>
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={72}
          height={72}
        />
      </UICartItemImage>
      <UICartItemSummary
        title={item.name}
        activeVariations={
          item.skuName !== item.name
            ? [{ label: 'Variant', option: item.skuName }]
            : undefined
        }
      />
    </UICartItem>
  )
}
