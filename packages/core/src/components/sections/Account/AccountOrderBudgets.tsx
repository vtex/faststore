import BudgetsCard from 'src/components/account/orders/OrderDetails/BudgetsCard'
import {
  type OrderBudgetsSectionLabels,
  defaultOrderBudgetsLabels,
} from 'src/components/account/orders/OrderDetails/orderDetailsLabels'
import {
  type AccountOrderDetailsPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountOrderBudgetsProps = OrderBudgetsSectionLabels

const AccountOrderBudgets = (props: AccountOrderBudgetsProps) => {
  const labels = { ...defaultOrderBudgetsLabels, ...props }
  const { order } = useAccountPageData<AccountOrderDetailsPageData>()

  if (!order?.budgetData) {
    return null
  }

  return (
    <Section className="section-account-order-budgets">
      <BudgetsCard
        budgetData={order.budgetData}
        currencyCode={order.storePreferencesData.currencyCode}
        labels={labels}
      />
    </Section>
  )
}

AccountOrderBudgets.$componentKey = 'AccountOrderBudgets'

export default AccountOrderBudgets
