import { Icon } from '@faststore/ui'

import type {
  Shipping,
  Delivery,
  PreviewDelivery,
  SingleSlaDelivery,
  Pickup,
  PreviewPickup,
  ShippingAddress,
} from '../../context/types'

import styles from './Shipping.module.scss'

interface SelectedDeliveryInformationProps {
  shipping: Shipping
}

function formatAddress(address: ShippingAddress): string {
  const parts = [
    address.street,
    address.number,
    address.neighborhood,
    address.city,
    address.state,
    address.postalCode,
  ].filter(Boolean)

  return parts.join(', ')
}

function formatShippingDate(date: { day: number; month: string; weekDay: string }): string {
  return `${date.weekDay}, ${date.month} ${date.day}`
}

function DeliveryInfo({ delivery }: { delivery: Shipping['delivery'] }) {
  if (delivery.__typename === 'EmptyDelivery') {
    return (
      <div className={styles.shippingInfoEmpty}>
        <Icon name="MapPin" width={18} height={18} />
        <span>Add a delivery address</span>
      </div>
    )
  }

  if (delivery.__typename === 'NoSlasDelivery') {
    return (
      <div className={styles.shippingInfoNoSlas}>
        <Icon name="Warning" width={18} height={18} />
        <span>No delivery options available for this address</span>
      </div>
    )
  }

  if (delivery.__typename === 'PreviewDelivery') {
    const preview = delivery as PreviewDelivery
    const { bestOptions, address } = preview

    return (
      <div className={styles.shippingInfoDelivery}>
        <div className={styles.shippingInfoHeader}>
          <Icon name="Truck" width={18} height={18} />
          <span>Delivery</span>
        </div>
        <p className={styles.shippingInfoAddress}>
          {formatAddress(address)}
        </p>
        <p className={styles.shippingInfoEstimate}>
          {bestOptions.name} - {bestOptions.total.asCurrency}
          <br />
          Estimated: {formatShippingDate(bestOptions.estimateDate)}
        </p>
      </div>
    )
  }

  if (delivery.__typename === 'Delivery') {
    const del = delivery as Delivery
    const { selected, address } = del

    return (
      <div className={styles.shippingInfoDelivery}>
        <div className={styles.shippingInfoHeader}>
          <Icon name="Truck" width={18} height={18} />
          <span>Delivery</span>
        </div>
        <p className={styles.shippingInfoAddress}>
          {formatAddress(address)}
        </p>
        {selected.__typename === 'SingleSlaDelivery' && (
          <p className={styles.shippingInfoEstimate}>
            {(selected as SingleSlaDelivery).name} -{' '}
            {selected.total.asCurrency}
            <br />
            Estimated:{' '}
            {formatShippingDate(
              (selected as SingleSlaDelivery).estimateDate
            )}
          </p>
        )}
        {selected.__typename === 'MultiSlaDelivery' && (
          <p className={styles.shippingInfoEstimate}>
            {selected.total.asCurrency} - Multiple packages
          </p>
        )}
      </div>
    )
  }

  return null
}

function PickupInfo({ pickup }: { pickup: Shipping['pickup'] }) {
  if (pickup.__typename === 'EmptyPickup') return null

  if (pickup.__typename === 'NoSlasPickup') {
    return (
      <div className={styles.shippingInfoNoSlas}>
        <Icon name="Warning" width={18} height={18} />
        <span>No pickup options available</span>
      </div>
    )
  }

  const option =
    pickup.__typename === 'Pickup'
      ? (pickup as Pickup).selected
      : (pickup as PreviewPickup).bestOption

  return (
    <div className={styles.shippingInfoPickup}>
      <div className={styles.shippingInfoHeader}>
        <Icon name="MapPin" width={18} height={18} />
        <span>Pickup</span>
      </div>
      <p className={styles.shippingInfoAddress}>
        {option.name}
        <br />
        {formatAddress(option.address)}
      </p>
      {option.distance && (
        <p className={styles.shippingInfoDistance}>{option.distance}</p>
      )}
      <p className={styles.shippingInfoEstimate}>
        Estimated: {formatShippingDate(option.estimateDate)}
      </p>
    </div>
  )
}

export default function SelectedDeliveryInformation({
  shipping,
}: SelectedDeliveryInformationProps) {
  const showDelivery =
    shipping.mode === 'DELIVERY' || shipping.mode === 'MULTIDELIVERY'
  const showPickup =
    shipping.mode === 'PICKUP' || shipping.mode === 'MULTIDELIVERY'

  if (shipping.mode === 'EMPTY') {
    return (
      <div className={styles.shippingInfo} data-fs-selected-delivery-info>
        <div className={styles.shippingInfoEmpty}>
          <Icon name="MapPin" width={18} height={18} />
          <span>Add a shipping address to see delivery options</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.shippingInfo} data-fs-selected-delivery-info>
      {showDelivery && <DeliveryInfo delivery={shipping.delivery} />}
      {showPickup && <PickupInfo pickup={shipping.pickup} />}
    </div>
  )
}
