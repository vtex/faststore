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

      const allocations = budget.allocations.filter(Boolean)

      // Calculate toBeSpent: sum all reservation values from all allocations
      // reservations is an object (key: value), so we need to sum all values
      const toBeSpent = allocations.reduce((total, allocation) => {
        if (!allocation?.reservations) return total

        const reservations = allocation.reservations
        // If reservations is an object, sum all its values
        if (typeof reservations === 'object' && reservations !== null) {
          const reservationValues = Object.values(reservations).filter(
            (val): val is number => typeof val === 'number'
          )
          return total + reservationValues.reduce((sum, val) => sum + val, 0)
        }

        return total
      }, 0)

      // Get remaining from budget.balance.remaining
      const remaining = budget.balance?.remaining || 0

      // Calculate available: toBeSpent + remaining
      const available = toBeSpent + remaining

      // Get list of allocation linkedEntity IDs
      const allocationIds = allocations
        .map((allocation) => allocation?.linkedEntity?.id)
        .filter(Boolean)
        .join(', ')

      return {
        budget,
        allocationIds,
        toBeSpent,
        remaining,
        available,
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
            (
              { budget, allocationIds, toBeSpent, remaining, available },
              index
            ) => {
              if (!budget) return null

              const budgetName = budget.name || ''
              const allocationsList = allocationIds || ''

              return (
                <div key={budget.id || index}>
                  <div data-fs-budgets-name>
                    <div data-fs-budgets-name-primary>
                      {budgetName.length > 20
                        ? `${budgetName.substring(0, 20)}...`
                        : budgetName}
                    </div>
                    <div data-fs-budgets-name-secondary title={allocationsList}>
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
