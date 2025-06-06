import MyAccountCard from 'src/components/account/components/MyAccountCard'
import { useFormatPrice } from 'src/components/account/utils/useFormatPrice'
import { useSession } from 'src/sdk/session'

// Interface for order totals (items, shipping, discounts)
// TODO: Use type from API
interface Total {
  id: string
  name: string
  value: number
}

// Interface for payment transactions
// TODO: Use type from API
interface Transaction {
  isActive: boolean
  payments: Array<{
    value: number
    referenceValue: number
  }>
}

interface MyAccountSummaryCardProps {
  totals: Total[]
  currencyCode: string
  transactions: Transaction[]
}

function MyAccountSummaryCard({
  totals,
  currencyCode,
  transactions,
}: MyAccountSummaryCardProps) {
  const formatPrice = useFormatPrice()

  // Calculate any payment surcharges from active transactions
  const calculatePaymentSurcharge = () => {
    let surchargeAmount = 0

    transactions.forEach((transaction) => {
      if (transaction.isActive) {
        transaction.payments.forEach((payment) => {
          const baseAmount =
            payment.referenceValue === 0
              ? payment.value
              : payment.referenceValue
          const additionalCharge = payment.value - baseAmount
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
        name: 'Interest',
        value: surchargeAmount,
      }

      return [...totals, interestLineItem]
    }

    return totals
  }

  const displayTotals = getDisplayTotals()

  const totalAmount = displayTotals.reduce((sum, total) => sum + total.value, 0)

  return (
    <MyAccountCard title="Summary" data-fs-order-summary-card>
      {displayTotals.map((total) => (
        <div key={total.id} data-fs-order-summary-item>
          <span>{total.name}</span>
          <span>{formatPrice(total.value, currencyCode)}</span>
        </div>
      ))}
      <div data-fs-order-summary-item data-fs-order-summary-total>
        <span>Total</span>
        <span>{formatPrice(totalAmount, currencyCode)}</span>
      </div>
    </MyAccountCard>
  )
}

export default MyAccountSummaryCard
