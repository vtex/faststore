import { OrderSummary as UIOrderSummary } from '@faststore/ui'
import type { ReactNode } from 'react'
import OrderSummarySkeleton from 'src/components/skeletons/OrderSummarySkeleton/OrderSummarySkeleton'

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

  const subtotalLabel = `Subtotal (${numberOfItems} products)`

  return (
    <>
      <OrderSummarySkeleton
        subtotalLabel={subtotalLabel}
        loading={!(subTotal && total)}
      >
        <UIOrderSummary
          subtotalLabel={subtotalLabel}
          subtotalValue={useFormattedPrice(subTotal)}
          discountValue={discount > 0 ? `-${formattedDiscount}` : undefined}
          totalValue={useFormattedPrice(total)}
        />
      </OrderSummarySkeleton>

      {checkoutButton}
    </>
  )
}

export default OrderSummary
