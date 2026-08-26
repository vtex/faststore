import Card from 'src/components/account/components/Card'
import { useFormatPrice } from 'src/components/account/utils/useFormatPrice'
import {
  type OrderSummarySectionLabels,
  resolveOrderSummaryLabels,
} from '../orderDetailsLabels'

// Interface for order totals (items, shipping, discounts)
// TODO: Use type from API
interface Total {
  id: string | null
  name: string | null
  value: number | null
}

// Interface for payment transactions
// TODO: Use type from API
interface Transaction {
  isActive: boolean | null
  payments: Array<{
    value: number | null
    referenceValue: number | null
  } | null> | null
}

interface SummaryCardProps {
  totals?: Array<Total | null> | null
  currencyCode: string
  transactions?: Array<Transaction | null> | null
  labels?: OrderSummarySectionLabels
}

function SummaryCard({
  totals,
  currencyCode,
  transactions,
  labels: labelsProp,
}: SummaryCardProps) {
  const labels = resolveOrderSummaryLabels(labelsProp)
  const formatPrice = useFormatPrice()

  // Calculate any payment surcharges from active transactions
  const calculatePaymentSurcharge = () => {
    let surchargeAmount = 0

    transactions?.forEach((transaction) => {
      if (transaction?.isActive) {
        transaction.payments?.forEach((payment) => {
          if (!payment) {
            return
          }

          const baseAmount =
            payment.referenceValue === 0
              ? payment.value
              : payment.referenceValue
          const additionalCharge = (payment.value ?? 0) - (baseAmount ?? 0)
          surchargeAmount += additionalCharge
        })
      }
    })

    return surchargeAmount
  }

  const getDisplayTotals = () => {
    const surchargeAmount = calculatePaymentSurcharge()

    if (surchargeAmount > 0) {
      const interestLineItem = {
        id: 'Interest',
        name: labels.interestLabel,
        value: surchargeAmount,
      }

      return [...(totals ?? []), interestLineItem]
    }

    return totals ?? []
  }

  const displayTotals = getDisplayTotals()

  const totalAmount = displayTotals.reduce(
    (sum, total) => sum + (total?.value ?? 0),
    0
  )

  return (
    <Card title={labels.summaryTitle} data-fs-order-summary-card>
      {displayTotals.map((total) => (
        <div key={total?.id} data-fs-order-summary-item>
          <span>{total?.name}</span>
          <span>{formatPrice(total?.value ?? 0, currencyCode)}</span>
        </div>
      ))}
      <div data-fs-order-summary-item data-fs-order-summary-total>
        <span>{labels.totalLabel}</span>
        <span>{formatPrice(totalAmount, currencyCode)}</span>
      </div>
    </Card>
  )
}

export default SummaryCard
