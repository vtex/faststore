import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'
import Card from 'src/components/account/components/Card'
import { useFormatPrice } from 'src/components/account/utils/useFormatPrice'
import {
  type OrderBudgetsSectionLabels,
  resolveOrderBudgetsLabels,
} from '../orderDetailsLabels'

interface BudgetsCardProps {
  budgetData: ServerOrderDetailsQueryQuery['userOrder']['budgetData']
  currencyCode: string
  labels?: OrderBudgetsSectionLabels
}

function BudgetsCard({
  budgetData,
  currencyCode,
  labels: labelsProp,
}: BudgetsCardProps) {
  const labels = resolveOrderBudgetsLabels(labelsProp)
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

  if (budgetRows.length === 0) {
    return null
  }

  return (
    <Card title={labels.budgetsTitle} data-fs-order-budgets-card>
      <div data-fs-budgets-table>
        <div data-fs-budgets-table-header>
          <div data-fs-budgets-header-name>{labels.nameLabel}</div>
          <div data-fs-budgets-header-available>{labels.availableLabel}</div>
          <div data-fs-budgets-header-to-be-spent>{labels.toBeSpentLabel}</div>
          <div data-fs-budgets-header-remaining>{labels.remainingLabel}</div>
        </div>
        <div data-fs-budgets-table-body>
          {budgetRows.map(
            (
              { budget, allocationIds, toBeSpent, remaining, available },
              index
            ) => {
              const budgetName = budget.name || ''
              const allocationsList = allocationIds || ''

              return (
                <div data-fs-budgets-row key={budget.id || index}>
                  <div data-fs-budgets-name>
                    <div data-fs-budgets-name-primary>{budgetName}</div>
                    <div data-fs-budgets-name-secondary title={allocationsList}>
                      {allocationsList}
                    </div>
                  </div>
                  <div data-fs-budgets-available>
                    {Number.isFinite(available)
                      ? formatPrice(available, currencyCode)
                      : '—'}
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
    </Card>
  )
}

export default BudgetsCard
