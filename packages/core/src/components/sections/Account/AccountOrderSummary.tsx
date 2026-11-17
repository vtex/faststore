import type { ComponentProps } from 'react'
import SummaryCard from 'src/components/account/orders/OrderDetails/SummaryCard'
import {
  type OrderSummarySectionLabels,
  defaultOrderSummaryLabels,
} from 'src/components/account/orders/OrderDetails/orderDetailsLabels'
import {
  type AccountOrderDetailsPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountOrderSummaryProps = OrderSummarySectionLabels

const AccountOrderSummary = (props: AccountOrderSummaryProps) => {
  const labels = { ...defaultOrderSummaryLabels, ...props }
  const { order } = useAccountPageData<AccountOrderDetailsPageData>()

  if (!order) {
    return null
  }

  return (
    <Section className="section-account-order-summary">
      <SummaryCard
        totals={order.totals as ComponentProps<typeof SummaryCard>['totals']}
        currencyCode={order.storePreferencesData?.currencyCode ?? ''}
        transactions={
          order.paymentData?.transactions as ComponentProps<
            typeof SummaryCard
          >['transactions']
        }
        labels={labels}
      />
    </Section>
  )
}

AccountOrderSummary.$componentKey = 'AccountOrderSummary'

export default AccountOrderSummary
