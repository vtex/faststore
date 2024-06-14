import { OrderSummary as UIOrderSummary } from '@faststore/ui'
import type { ReactNode } from 'react'

import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

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
    <>
      <UIOrderSummary
        subtotalLabel={`Subtotal (${numberOfItems} products)`}
        subtotalValue={useFormattedPrice(subTotal)}
        discountValue={discount > 0 ? `-${formattedDiscount}` : undefined}
        totalValue={useFormattedPrice(total)}
      />
      {checkoutButton}
    </>
  )
}

export default OrderSummary
