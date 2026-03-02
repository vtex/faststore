import { Alert, Icon } from '@faststore/ui'

import CartPageItem from '../CartItem/CartPageItem'
import CartItemUnavailable from '../CartItem/CartItemUnavailable'
import type {
  Product,
  BaseProductUnavailable,
  Shipping,
} from '../../context/types'

import styles from './CartList.module.scss'

interface CartListProps {
  items: Product[]
  unavailableItems: BaseProductUnavailable[]
  shipping: Shipping | null
}

export default function CartList({
  items,
  unavailableItems,
  shipping,
}: CartListProps) {
  const hasUnavailable = unavailableItems.length > 0
  const isGrouped = shipping?.mode === 'DELIVERY' || shipping?.mode === 'PICKUP'

  return (
    <div className={styles.cartList}>
      {hasUnavailable && (
        <div className={styles.cartListUnavailable}>
          <Alert icon={<Icon name="Warning" />}>
            Some items in your cart need review
          </Alert>
          <ul className={styles.cartListItems}>
            {unavailableItems.map((item) => (
              <li key={item.id}>
                <CartItemUnavailable item={item} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {isGrouped && shipping?.mode !== 'MULTIDELIVERY' ? (
        <CartListGroupedByChannel items={items} shipping={shipping} />
      ) : (
        <ul className={styles.cartListItems}>
          {items.map((item) => (
            <li key={item.id}>
              <CartPageItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface CartListGroupedByChannelProps {
  items: Product[]
  shipping: Shipping
}

function CartListGroupedByChannel({
  items,
  shipping,
}: CartListGroupedByChannelProps) {
  const deliveryItems = items.filter((item) => {
    if (!item.selectedShippingOption) return true
    return item.selectedShippingOption.__typename !== 'ProductPickupOption'
  })

  const pickupItems = items.filter(
    (item) =>
      item.selectedShippingOption?.__typename === 'ProductPickupOption'
  )

  const hasDelivery = shipping.deliveryChannels.includes('DELIVERY')
  const hasPickup = shipping.deliveryChannels.includes('PICKUP')

  return (
    <div className={styles.cartListGrouped}>
      {hasDelivery && deliveryItems.length > 0 && (
        <div className={styles.cartListGroup}>
          <h3 className={styles.cartListGroupTitle}>
            <Icon name="Truck" width={20} height={20} />
            Delivery
          </h3>
          <ul className={styles.cartListItems}>
            {deliveryItems.map((item) => (
              <li key={item.id}>
                <CartPageItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasPickup && pickupItems.length > 0 && (
        <div className={styles.cartListGroup}>
          <h3 className={styles.cartListGroupTitle}>
            <Icon name="MapPin" width={20} height={20} />
            Pickup
          </h3>
          <ul className={styles.cartListItems}>
            {pickupItems.map((item) => (
              <li key={item.id}>
                <CartPageItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
