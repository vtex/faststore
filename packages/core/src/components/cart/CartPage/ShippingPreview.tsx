import { useState } from 'react'
import type {
  BffDeliveryUnion,
  BffShippingAddress,
  BffSingleSlaDelivery,
  AddressSuggestionData,
  CompleteAddressSuggestion,
} from 'src/sdk/checkout/operations/cartOperations'

import AddressAutocomplete from './AddressAutocomplete'
import styles from './cart-page.module.scss'

interface ShippingPreviewProps {
  delivery: BffDeliveryUnion | null
  currencyCode: string
  locale: string
  onSearchAddress?: (query: string) => Promise<AddressSuggestionData>
  onSelectCompleteAddress?: (
    suggestion: CompleteAddressSuggestion
  ) => Promise<unknown>
  onSelectIncompleteAddress?: (
    placeId: string,
    addressQuery: string
  ) => Promise<unknown>
}

function formatEstimate(
  estimate: BffSingleSlaDelivery['estimateDate']
): string {
  if (estimate.inBusinessDays <= 0 && estimate.inHours > 0) {
    return `${estimate.inHours}h`
  }
  if (estimate.inBusinessDays === 1) {
    return '1 business day'
  }
  if (estimate.inBusinessDays > 1) {
    return `${estimate.inBusinessDays} business days`
  }
  return `${estimate.weekDay}, ${estimate.month} ${estimate.day}`
}

function AddressDisplay({ address }: { address: BffShippingAddress }) {
  return (
    <div className={styles.shippingAddress}>
      <p style={{ margin: 0 }}>
        {address.street}
        {address.number && `, ${address.number}`}
      </p>
      <p style={{ margin: 0 }}>
        {address.neighborhood && `${address.neighborhood} · `}
        {address.city}, {address.state} {address.postalCode}
      </p>
    </div>
  )
}

function DeliveryOptionRow({
  option,
  isSelected,
}: {
  option: BffSingleSlaDelivery
  isSelected?: boolean
}) {
  return (
    <div className={styles.shippingOption}>
      <span>
        {option.name}
        {isSelected && ' ✓'}
      </span>
      <span>
        {option.total.asNumber === 0 ? 'Free' : option.total.asCurrency}
        {' · '}
        {formatEstimate(option.estimateDate)}
      </span>
    </div>
  )
}

function AddressInput({
  onSearchAddress,
  onSelectCompleteAddress,
  onSelectIncompleteAddress,
  collapsed,
}: {
  onSearchAddress: (query: string) => Promise<AddressSuggestionData>
  onSelectCompleteAddress: (
    suggestion: CompleteAddressSuggestion
  ) => Promise<unknown>
  onSelectIncompleteAddress: (
    placeId: string,
    addressQuery: string
  ) => Promise<unknown>
  collapsed?: boolean
}) {
  const [isOpen, setIsOpen] = useState(!collapsed)

  if (collapsed && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.8125rem',
          color: 'var(--fs-color-primary-bkg, #2953b2)',
          textDecoration: 'underline',
          padding: '0.5rem 0 0',
          display: 'block',
        }}
      >
        Change address
      </button>
    )
  }

  return (
    <div style={{ marginTop: collapsed ? '0.75rem' : 0 }}>
      <AddressAutocomplete
        onSearchAddress={onSearchAddress}
        onSelectComplete={onSelectCompleteAddress}
        onSelectIncomplete={onSelectIncompleteAddress}
      />
    </div>
  )
}

function ShippingPreview({
  delivery,
  onSearchAddress,
  onSelectCompleteAddress,
  onSelectIncompleteAddress,
}: ShippingPreviewProps) {
  if (!delivery) return null

  const hasAutocomplete =
    onSearchAddress && onSelectCompleteAddress && onSelectIncompleteAddress

  const { __typename } = delivery

  if (__typename === 'EmptyDelivery') {
    return (
      <div className={styles.shippingPreview} data-fs-shipping-preview>
        <h3 className={styles.shippingTitle}>Shipping</h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#757575',
            margin: '0 0 0.75rem',
          }}
        >
          Enter your address to calculate shipping
        </p>
        {hasAutocomplete && (
          <AddressInput
            onSearchAddress={onSearchAddress}
            onSelectCompleteAddress={onSelectCompleteAddress}
            onSelectIncompleteAddress={onSelectIncompleteAddress}
          />
        )}
      </div>
    )
  }

  if (__typename === 'NoSlasDelivery') {
    return (
      <div className={styles.shippingPreview} data-fs-shipping-preview>
        <h3 className={styles.shippingTitle}>Shipping</h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#757575',
            margin: '0 0 0.5rem',
          }}
        >
          No shipping options available for this address
        </p>
        <AddressDisplay address={delivery.address} />
        {hasAutocomplete && (
          <AddressInput
            onSearchAddress={onSearchAddress}
            onSelectCompleteAddress={onSelectCompleteAddress}
            onSelectIncompleteAddress={onSelectIncompleteAddress}
            collapsed
          />
        )}
      </div>
    )
  }

  if (__typename === 'PreviewDelivery') {
    return (
      <div className={styles.shippingPreview} data-fs-shipping-preview>
        <h3 className={styles.shippingTitle}>Shipping</h3>
        <DeliveryOptionRow option={delivery.bestOptions} />
        <AddressDisplay address={delivery.address} />
        {hasAutocomplete && (
          <AddressInput
            onSearchAddress={onSearchAddress}
            onSelectCompleteAddress={onSelectCompleteAddress}
            onSelectIncompleteAddress={onSelectIncompleteAddress}
            collapsed
          />
        )}
      </div>
    )
  }

  // __typename === 'Delivery'
  return (
    <div className={styles.shippingPreview} data-fs-shipping-preview>
      <h3 className={styles.shippingTitle}>Shipping</h3>
      {delivery.options.map((option) => (
        <DeliveryOptionRow
          key={option.id}
          option={option}
          isSelected={option.id === delivery.selected?.id}
        />
      ))}
      <AddressDisplay address={delivery.address} />
      {hasAutocomplete && (
        <AddressInput
          onSearchAddress={onSearchAddress}
          onSelectCompleteAddress={onSelectCompleteAddress}
          onSelectIncompleteAddress={onSelectIncompleteAddress}
          collapsed
        />
      )}
    </div>
  )
}

export default ShippingPreview
