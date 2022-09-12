import { OrderSummary as UIOrderSummary } from '@faststore/ui'
import type { ReactNode } from 'react'

import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

import styles from './order-summary.module.scss'

interface OrderSummaryProps {
  subTotal: number
  total: number
  numberOfItems: number
  checkoutButton?: ReactNode
}

function OrderSummary({
  subTotal,
  total,
  numberOfItems,
  checkoutButton,
}: OrderSummaryProps) {
  const discount = subTotal - total
  const formattedDiscount = useFormattedPrice(discount)

  return (
    <div className={styles.fsOrderSummary}>
      <UIOrderSummary
        subtotalLabel={`Subtotal (${numberOfItems} products)`}
        subtotalValue={useFormattedPrice(subTotal)}
        discountLabel="Discount"
        discountValue={discount > 0 ? `-${formattedDiscount}` : undefined}
        totalLabel="Total"
        totalValue={useFormattedPrice(total)}
      />
      {checkoutButton}
    </div>
  )
}

export default OrderSummary
