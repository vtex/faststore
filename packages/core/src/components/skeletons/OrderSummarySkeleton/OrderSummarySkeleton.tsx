import { List } from '@faststore/ui'
import { type PropsWithChildren } from 'react'
import { Skeleton as UISkeleton } from '@faststore/components'

interface OrderSummarySkeletonProps {
  /**
   * Control whether skeleton should be visible or not.
   */
  loading?: boolean
  subtotalLabel: string
}

function OrderSummarySkeleton({
  children,
  loading = true,
  subtotalLabel,
}: PropsWithChildren<OrderSummarySkeletonProps>) {
  const discountLabel = 'Discount'
  const totalLabel = 'Total'

  return loading ? (
    <List data-fs-order-summary={true}>
      <li data-fs-order-summary-subtotal={true}>
        <span data-fs-order-summary-subtotal-label={true}>{subtotalLabel}</span>
        <span
          data-fs-order-summary-subtotal-value={true}
          style={{ marginTop: '3px' }}
        >
          <UISkeleton size={{ width: '85px', height: '1rem' }} />
        </span>
      </li>

      <li data-fs-order-summary-discount={true}>
        <span data-fs-order-summary-discount-label={true}>{discountLabel}</span>
        <span
          data-fs-order-summary-discount-value={true}
          style={{ marginTop: '3px' }}
        >
          <UISkeleton size={{ width: '85px', height: '1rem' }} />
        </span>
      </li>
      <li data-fs-order-summary-total={true}>
        <span data-fs-order-summary-total-label={true}>{totalLabel}</span>
        <span
          data-fs-order-summary-total-value={true}
          style={{ marginTop: '3px' }}
        >
          <UISkeleton size={{ width: '85px', height: '1rem' }} />
        </span>
      </li>
    </List>
  ) : (
    <>{children}</>
  )
}

export default OrderSummarySkeleton
