import { Icon, RadioField, RadioGroup } from '@faststore/ui'
import { useCallback } from 'react'

import { useCartPage } from '../../context/CartPageContext'
import type { DeliveryChannel, ShippingMode } from '../../context/types'

import styles from './Shipping.module.scss'

interface ShippingChannelSelectorProps {
  deliveryChannels: DeliveryChannel[]
  mode: ShippingMode
}

export default function ShippingChannelSelector({
  deliveryChannels,
  mode,
}: ShippingChannelSelectorProps) {
  const { selectDeliveryChannel } = useCartPage()

  const currentChannel =
    mode === 'PICKUP' ? 'pickup-in-point' : 'delivery'

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const channel = e.currentTarget.value as 'delivery' | 'pickup-in-point'

      selectDeliveryChannel(channel)
    },
    [selectDeliveryChannel]
  )

  if (deliveryChannels.length < 2) return null

  return (
    <div className={styles.shippingChannelSelector} data-fs-shipping-channel-selector>
      <RadioGroup
        name="shipping-channel"
        selectedValue={currentChannel}
        onChange={handleChange}
      >
        {deliveryChannels.includes('DELIVERY') && (
          <RadioField
            id="channel-delivery"
            label={
              <span className={styles.shippingChannelLabel}>
                <Icon name="Truck" width={18} height={18} />
                Delivery
              </span>
            }
            value="delivery"
            checked={currentChannel === 'delivery'}
          />
        )}
        {deliveryChannels.includes('PICKUP') && (
          <RadioField
            id="channel-pickup"
            label={
              <span className={styles.shippingChannelLabel}>
                <Icon name="MapPin" width={18} height={18} />
                Pickup
              </span>
            }
            value="pickup-in-point"
            checked={currentChannel === 'pickup-in-point'}
          />
        )}
      </RadioGroup>
    </div>
  )
}
