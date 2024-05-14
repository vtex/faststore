import {
  OrderSummary as UIOrderSummary,
  OrderSummaryProps as UIOrderSummaryProps,
} from '@faststore/ui'
import type { ReactNode } from 'react'

import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

type OrderSummaryProps = {
  subTotal: number
  total: number
  numberOfItems: number
  checkoutButton?: ReactNode
} & UIOrderSummaryProps

function OrderSummary({
  subTotal,
  total,
  numberOfItems,
  checkoutButton,
  ...otherProps
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
        {...otherProps}
      />
      {checkoutButton}
    </>
  )
}

export default OrderSummary
