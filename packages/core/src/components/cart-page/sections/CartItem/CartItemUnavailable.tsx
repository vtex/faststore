import { Button, Icon } from '@faststore/ui'
import { useCallback } from 'react'

import { Image } from 'src/components/ui/Image'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useCartPage } from '../../context/CartPageContext'
import type {
  BaseProductUnavailable,
  PriceWithDiscount,
} from '../../context/types'

import styles from './CartPageItem.module.scss'

interface CartItemUnavailableProps {
  item: BaseProductUnavailable
}

function getUnavailablePrice(item: BaseProductUnavailable) {
  if (!item.price) return null

  if (item.price.__typename === 'PriceWithDiscount') {
    return (item.price as PriceWithDiscount).valueWithDiscount.asNumber
  }

  return item.price.value.asNumber
}

export default function CartItemUnavailable({
  item,
}: CartItemUnavailableProps) {
  const { removeProduct, mutating } = useCartPage()
  const price = getUnavailablePrice(item)
  const formattedPrice = useFormattedPrice(price ?? 0)

  const handleRemove = useCallback(() => {
    removeProduct(item.originalIndex)
  }, [removeProduct, item.originalIndex])

  return (
    <article className={styles.cartPageItem} data-fs-cart-item="unavailable">
      <div data-fs-cart-item-content>
        <div data-fs-cart-item-image>
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={72}
            height={72}
          />
        </div>
        <div data-fs-cart-item-summary>
          <p data-fs-cart-item-title>{item.name}</p>
          {item.skuName !== item.name && (
            <span data-fs-cart-item-sku>{item.skuName}</span>
          )}
          {price != null && (
            <span data-fs-cart-item-unavailable-price>{formattedPrice}</span>
          )}
        </div>
      </div>
      <Button
        variant="tertiary"
        size="small"
        onClick={handleRemove}
        disabled={mutating}
        icon={<Icon name="XCircle" />}
        iconPosition="left"
      >
        Remove
      </Button>
    </article>
  )
}
