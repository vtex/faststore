import { Button, Icon } from '@faststore/ui'

import type {
  Shipping,
  Pickup as PickupType,
  PreviewPickup,
  PickupOption,
} from '../../context/types'

import styles from './Shipping.module.scss'

interface PickupProps {
  shipping: Shipping
}

function PickupPointCard({ option }: { option: PickupOption }) {
  return (
    <div className={styles.pickupPointCard}>
      <div className={styles.pickupPointHeader}>
        <Icon name="MapPin" width={16} height={16} />
        <strong>{option.name}</strong>
      </div>
      <p className={styles.pickupPointAddress}>
        {[
          option.address.street,
          option.address.number,
          option.address.city,
          option.address.state,
        ]
          .filter(Boolean)
          .join(', ')}
      </p>
      {option.distance && (
        <span className={styles.pickupPointDistance}>{option.distance}</span>
      )}
      <p className={styles.pickupPointEstimate}>
        Ready by {option.estimateDate.weekDay}, {option.estimateDate.month}{' '}
        {option.estimateDate.day}
      </p>
      {option.businessHours && option.businessHours.length > 0 && (
        <div className={styles.pickupPointHours}>
          {option.businessHours.map((bh) => (
            <span key={bh.day}>
              Day {bh.day}: {bh.openingTime} - {bh.closingTime}
            </span>
          ))}
        </div>
      )}
      {option.totalizers && (
        <p className={styles.pickupPointCost}>
          {option.totalizers.shipping.asNumber === 0
            ? 'Free pickup'
            : option.totalizers.shipping.asCurrency}
        </p>
      )}
    </div>
  )
}

export default function Pickup({ shipping }: PickupProps) {
  const { pickup } = shipping

  if (pickup.__typename === 'EmptyPickup') {
    return (
      <div className={styles.pickupSection}>
        <Button
          variant="secondary"
          icon={<Icon name="MapPin" width={18} height={18} />}
          iconPosition="left"
        >
          Search pickup points
        </Button>
      </div>
    )
  }

  if (pickup.__typename === 'NoSlasPickup') {
    return (
      <div className={styles.pickupSection}>
        <p className={styles.pickupNoSlas}>
          No pickup points available near this address
        </p>
      </div>
    )
  }

  if (pickup.__typename === 'Pickup') {
    const p = pickup as PickupType

    return (
      <div className={styles.pickupSection}>
        <h4 className={styles.pickupTitle}>
          <Icon name="MapPin" width={18} height={18} />
          Selected Pickup Point
        </h4>
        <PickupPointCard option={p.selected} />
        {p.options.length > 1 && (
          <details className={styles.pickupOtherOptions}>
            <summary>
              {p.options.length - 1} other pickup point
              {p.options.length - 1 > 1 ? 's' : ''} available
            </summary>
            <div className={styles.pickupOptionsList}>
              {p.options
                .filter((opt) => opt.id !== p.selected.id)
                .map((opt) => (
                  <PickupPointCard key={opt.id} option={opt} />
                ))}
            </div>
          </details>
        )}
      </div>
    )
  }

  if (pickup.__typename === 'PreviewPickup') {
    const p = pickup as PreviewPickup

    return (
      <div className={styles.pickupSection}>
        <h4 className={styles.pickupTitle}>
          <Icon name="MapPin" width={18} height={18} />
          Closest Pickup Point
        </h4>
        <PickupPointCard option={p.bestOption} />
        {p.options.length > 1 && (
          <details className={styles.pickupOtherOptions}>
            <summary>
              View all {p.options.length} pickup points
            </summary>
            <div className={styles.pickupOptionsList}>
              {p.options.map((opt) => (
                <PickupPointCard key={opt.id} option={opt} />
              ))}
            </div>
          </details>
        )}
      </div>
    )
  }

  return null
}
