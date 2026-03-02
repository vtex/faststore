import { Button, Icon, RadioField, RadioGroup } from '@faststore/ui'
import { useCallback, useState } from 'react'

import { useCartPage } from '../../context/CartPageContext'
import type {
  Shipping,
  Delivery as DeliveryType,
  SingleSlaDelivery,
  MultiSlaDelivery,
  ShippingAddress,
} from '../../context/types'
import ShippingAddressDrawer from './ShippingAddressDrawer'

import styles from './Shipping.module.scss'

interface DeliveryProps {
  shipping: Shipping
}

function formatAddress(address: ShippingAddress): string {
  const parts = [
    address.street,
    address.number,
    address.city,
    address.state,
    address.postalCode,
  ].filter(Boolean)

  return parts.join(', ')
}

function DeliverySlaSummary({ sla }: { sla: SingleSlaDelivery | MultiSlaDelivery }) {
  if (sla.__typename === 'SingleSlaDelivery') {
    const single = sla as SingleSlaDelivery

    return (
      <span>
        {single.name} - {single.total.asCurrency} (
        {single.estimateDate.weekDay}, {single.estimateDate.month}{' '}
        {single.estimateDate.day})
      </span>
    )
  }

  const multi = sla as MultiSlaDelivery

  return (
    <span>
      {multi.totalPackages} packages - {multi.total.asCurrency}
    </span>
  )
}

export default function Delivery({ shipping }: DeliveryProps) {
  const { selectSingleSla } = useCartPage()
  const [showAddressDrawer, setShowAddressDrawer] = useState(false)
  const { delivery } = shipping

  const handleSlaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      selectSingleSla(e.currentTarget.value)
    },
    [selectSingleSla]
  )

  if (delivery.__typename === 'EmptyDelivery') {
    return (
      <div className={styles.deliverySection}>
        <Button
          variant="secondary"
          onClick={() => setShowAddressDrawer(true)}
          icon={<Icon name="MapPin" width={18} height={18} />}
          iconPosition="left"
        >
          Add delivery address
        </Button>
        <ShippingAddressDrawer
          isOpen={showAddressDrawer}
          onClose={() => setShowAddressDrawer(false)}
        />
      </div>
    )
  }

  if (delivery.__typename === 'NoSlasDelivery') {
    return (
      <div className={styles.deliverySection}>
        <p className={styles.deliveryNoSlas}>
          No delivery options available for this address
        </p>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setShowAddressDrawer(true)}
        >
          Change address
        </Button>
        <ShippingAddressDrawer
          isOpen={showAddressDrawer}
          onClose={() => setShowAddressDrawer(false)}
        />
      </div>
    )
  }

  if (delivery.__typename === 'Delivery') {
    const del = delivery as DeliveryType
    const { selected, options, address } = del
    const selectedId = selected.id

    return (
      <div className={styles.deliverySection}>
        <div className={styles.deliveryAddress}>
          <p>{formatAddress(address)}</p>
          <Button
            variant="tertiary"
            size="small"
            onClick={() => setShowAddressDrawer(true)}
          >
            Change
          </Button>
        </div>

        {options.length > 1 && (
          <RadioGroup
            name="delivery-sla"
            selectedValue={selectedId}
            onChange={handleSlaChange}
          >
            {options.map((option) => (
              <RadioField
                key={option.id}
                id={`sla-${option.id}`}
                label={<DeliverySlaSummary sla={option} />}
                value={option.id}
                checked={option.id === selectedId}
              />
            ))}
          </RadioGroup>
        )}

        {options.length <= 1 && (
          <div className={styles.deliverySlaInfo}>
            <DeliverySlaSummary sla={selected} />
          </div>
        )}

        <ShippingAddressDrawer
          isOpen={showAddressDrawer}
          onClose={() => setShowAddressDrawer(false)}
        />
      </div>
    )
  }

  if (delivery.__typename === 'PreviewDelivery') {
    const { bestOptions, address } = delivery

    return (
      <div className={styles.deliverySection}>
        <div className={styles.deliveryAddress}>
          <p>{formatAddress(address)}</p>
          <Button
            variant="tertiary"
            size="small"
            onClick={() => setShowAddressDrawer(true)}
          >
            Change
          </Button>
        </div>
        <div className={styles.deliverySlaInfo}>
          <DeliverySlaSummary sla={bestOptions} />
        </div>
        <ShippingAddressDrawer
          isOpen={showAddressDrawer}
          onClose={() => setShowAddressDrawer(false)}
        />
      </div>
    )
  }

  return null
}
