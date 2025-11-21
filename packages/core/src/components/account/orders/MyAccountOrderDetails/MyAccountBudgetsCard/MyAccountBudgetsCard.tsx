import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'
import MyAccountCard from 'src/components/account/components/MyAccountCard'
import { useFormatPrice } from 'src/components/account/utils/useFormatPrice'

interface MyAccountBudgetsCardProps {
  budgetData: ServerOrderDetailsQueryQuery['userOrder']['budgetData']
  currencyCode: string
}

function MyAccountBudgetsCard({
  budgetData,
  currencyCode,
}: MyAccountBudgetsCardProps) {
  const formatPrice = useFormatPrice()

  if (!budgetData?.budgets || budgetData.budgets.length === 0) {
    return null
  }

  // Process each budget to display correctly
  const budgetRows = budgetData.budgets
    .filter(
      (budget) => budget && budget.allocations && budget.allocations.length > 0
    )
    .map((budget) => {
      if (!budget || !budget.allocations) return null

      // Find the allocation with the highest balance amount
      const allocations = budget.allocations.filter(Boolean)
      const largestAllocation = allocations.reduce((max, allocation) => {
        const maxAmount = max?.balance?.amount || 0
        const currentAmount = allocation?.balance?.amount || 0
        return currentAmount > maxAmount ? allocation : max
      }, allocations[0] || null)

      // Get list of allocation linkedEntity IDs
      const allocationIds = allocations
        .map((allocation) => allocation?.linkedEntity?.id)
        .filter(Boolean)
        .join(', ')

      return {
        budget,
        largestAllocation,
        allocationIds,
      }
    })
    .filter(Boolean)

  if (budgetRows.length === 0) {
    return null
  }

  return (
    <MyAccountCard title="Budgets" data-fs-order-budgets-card>
      <div data-fs-budgets-table>
        <div data-fs-budgets-table-header>
          <div data-fs-budgets-header-name>Name</div>
          <div data-fs-budgets-header-available>Available</div>
          <div data-fs-budgets-header-to-be-spent>To be spent</div>
          <div data-fs-budgets-header-remaining>Remaining</div>
        </div>
        <div data-fs-budgets-table-body>
          {budgetRows.map(
            ({ budget, largestAllocation, allocationIds }, index) => {
              if (!budget || !largestAllocation) return null

              const budgetName = budget.name || ''
              const allocationsList = allocationIds || ''

              // Values from the largest allocation
              const available = largestAllocation.balance?.amount || 0
              const toBeSpent =
                largestAllocation.balance?.balanceAdjustment || 0
              const remaining = largestAllocation.balance?.remaining || 0

              return (
                <div key={budget.id || index}>
                  <div data-fs-budgets-name>
                    <div data-fs-budgets-name-primary>
                      {budgetName.length > 20
                        ? `${budgetName.substring(0, 20)}...`
                        : budgetName}
                    </div>
                    <div data-fs-budgets-name-secondary>
                      {allocationsList.length > 20
                        ? `${allocationsList.substring(0, 20)}...`
                        : allocationsList}
                    </div>
                  </div>
                  <div data-fs-budgets-available>
                    {available ? formatPrice(available, currencyCode) : '—'}
                  </div>
                  <div data-fs-budgets-to-be-spent>
                    {toBeSpent !== 0
                      ? formatPrice(toBeSpent, currencyCode)
                      : formatPrice(0, currencyCode)}
                  </div>
                  <div data-fs-budgets-remaining>
                    <strong>{formatPrice(remaining, currencyCode)}</strong>
                  </div>
                </div>
              )
            }
          )}
        </div>
      </div>
    </MyAccountCard>
  )
}

export default MyAccountBudgetsCard
