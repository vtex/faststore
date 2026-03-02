import { Button, InputField, Icon } from '@faststore/ui'
import { useCallback, useState } from 'react'

import { useCartPage } from '../../context/CartPageContext'

import styles from './Shipping.module.scss'

interface ShippingAddressDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShippingAddressDrawer({
  isOpen,
  onClose,
}: ShippingAddressDrawerProps) {
  const { findAddressAndUpdate, mutating } = useCartPage()
  const [addressQuery, setAddressQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!addressQuery.trim()) return

      setIsSubmitting(true)

      try {
        await findAddressAndUpdate({
          placeId: '',
          addressQuery: addressQuery.trim(),
          addressId: null,
          addressType: 'residential',
          receiverName: null,
          strategy: 'ALL_ITEMS',
        })
        onClose()
      } catch {
        // Error handled by context
      } finally {
        setIsSubmitting(false)
      }
    },
    [addressQuery, findAddressAndUpdate, onClose]
  )

  if (!isOpen) return null

  return (
    <div className={styles.addressDrawerOverlay} data-fs-address-drawer>
      <div className={styles.addressDrawer}>
        <div className={styles.addressDrawerHeader}>
          <h3>Delivery Address</h3>
          <button
            type="button"
            className={styles.addressDrawerClose}
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="X" width={20} height={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.addressDrawerForm}>
          <InputField
            id="shipping-address-query"
            label="Enter your address or zip code"
            value={addressQuery}
            onChange={(e) => setAddressQuery(e.target.value)}
            disabled={isSubmitting || mutating}
          />

          <div className={styles.addressDrawerActions}>
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || mutating || !addressQuery.trim()}
            >
              {isSubmitting ? 'Searching...' : 'Apply'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
