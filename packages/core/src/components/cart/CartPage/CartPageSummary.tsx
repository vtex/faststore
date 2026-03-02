import type { ReactNode } from 'react'
import type { BffSummary } from 'src/sdk/checkout/operations/cartOperations'

import styles from './cart-page.module.scss'

interface CartPageSummaryProps {
  summary: BffSummary | null
  currencyCode: string
  locale: string
  checkoutButton?: ReactNode
}

function formatPrice(value: number, currencyCode: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(value)
}

function CartPageSummary({
  summary,
  currencyCode,
  locale,
  checkoutButton,
}: CartPageSummaryProps) {
  if (!summary) return null

  const { totalizers, total } = summary

  const rows: Array<{ label: string; value: string; isDiscount?: boolean }> = []

  if (totalizers.items) {
    rows.push({ label: 'Subtotal', value: totalizers.items })
  }

  if (totalizers.discounts) {
    rows.push({
      label: 'Discounts',
      value: totalizers.discounts,
      isDiscount: true,
    })
  }

  const { shipping } = totalizers
  if (shipping.__typename === 'ShippingTotalizer') {
    rows.push({ label: 'Shipping', value: shipping.value })
  } else if (shipping.__typename === 'FreeShippingTotalizer') {
    rows.push({ label: 'Shipping', value: 'Free' })
  }

  return (
    <div className={styles.summarySection} data-fs-cart-page-summary>
      <h3
        style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          margin: '0 0 0.75rem',
        }}
      >
        Order Summary
      </h3>

      <dl style={{ margin: 0 }}>
        {rows.map((row) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.375rem 0',
              fontSize: '0.875rem',
            }}
          >
            <dt style={{ color: '#757575' }}>{row.label}</dt>
            <dd style={{ margin: 0, fontWeight: 500 }}>{row.value}</dd>
          </div>
        ))}
      </dl>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #e0e0e0',
          paddingTop: '0.75rem',
          marginTop: '0.75rem',
          fontWeight: 700,
        }}
      >
        <span>Total</span>
        <span>{formatPrice(total.asNumber, currencyCode, locale)}</span>
      </div>

      {checkoutButton}
    </div>
  )
}

export default CartPageSummary
