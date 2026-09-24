/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import SummaryCard from '../../../../src/components/account/orders/OrderDetails/SummaryCard'

vi.mock('next/router', () => ({
  useRouter: () => ({ locale: 'en-US' }),
}))

describe('SummaryCard', () => {
  it('renders localized totals, interest, and the final total', () => {
    render(
      <SummaryCard
        totals={[
          { id: 'Items', name: 'Items from OMS', value: 1_000 },
          { id: 'FutureTotal', name: 'Future total from OMS', value: 100 },
        ]}
        currencyCode="USD"
        transactions={[
          {
            isActive: true,
            payments: [{ value: 1_200, referenceValue: 1_100 }],
          },
        ]}
        labels={{
          itemsTotalLabel: 'Products',
          interestLabel: 'Financing',
          totalLabel: 'Grand total',
        }}
      />
    )

    expect(screen.getByText('Products')).toBeTruthy()
    expect(screen.getByText('Future total from OMS')).toBeTruthy()
    expect(screen.getByText('Financing')).toBeTruthy()
    expect(screen.getByText('Grand total')).toBeTruthy()
  })

  it('does not add interest for inactive transactions', () => {
    render(
      <SummaryCard
        totals={[{ id: 'Items', name: 'Items from OMS', value: 1_000 }]}
        currencyCode="USD"
        transactions={[
          {
            isActive: false,
            payments: [{ value: 1_200, referenceValue: 1_000 }],
          },
        ]}
      />
    )

    expect(screen.queryByText('Interest')).toBeNull()
  })
})
