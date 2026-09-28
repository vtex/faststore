/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import StatusCard from '../../../../src/components/account/orders/OrderDetails/StatusCard'
import { formatDate } from '../../../../src/components/account/orders/OrderDetails/StatusCard/statusCardLocalization'

vi.mock('next/router', () => ({
  useRouter: () => ({ locale: 'pt-BR' }),
}))

describe('StatusCard', () => {
  it('renders timeline dates with the page locale', () => {
    const creationDate = '2026-08-05T18:30:00.000Z'

    render(<StatusCard status="payment-approved" creationDate={creationDate} />)

    const formatted = formatDate(creationDate, 'pt-BR')
    expect(screen.getByText(formatted.date)).toBeTruthy()
    expect(screen.getByText(formatted.time)).toBeTruthy()
  })

  it('renders the CMS status label for canceled orders', () => {
    render(
      <StatusCard
        status="canceled"
        creationDate="2026-08-05T18:30:00.000Z"
        statusLabels={{ canceledStatus: 'Cancelado' }}
      />
    )

    expect(screen.getByText('Cancelado')).toBeTruthy()
  })
})
