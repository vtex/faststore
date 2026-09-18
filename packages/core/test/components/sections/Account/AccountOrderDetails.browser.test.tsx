/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockUseAccountPageData = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountPageData: mockUseAccountPageData,
}))

vi.mock(
  'src/components/account/orders/OrderDetails/OrderDetailsHeader',
  () => ({
    OrderDetailsHeader: ({
      labels,
    }: {
      labels: Record<string, string | undefined>
    }) => (
      <div data-testid="order-details-header">
        <span data-testid="reject-modal-title">{labels.rejectModalTitle}</span>
        <span data-testid="reject-modal-message">
          {labels.rejectModalMessage}
        </span>
        <span data-testid="reject-modal-confirm">
          {labels.rejectModalConfirmText}
        </span>
      </div>
    ),
  })
)

import AccountOrderDetails from 'src/components/sections/Account/AccountOrderDetails'
import { defaultOrderDetailsHeaderLabels } from 'src/components/account/orders/OrderDetails/orderDetailsLabels'

const order = { orderId: '123' }

afterEach(cleanup)

describe('AccountOrderDetails', () => {
  it('forwards the default English reject modal labels when the CMS has no override', () => {
    mockUseAccountPageData.mockReturnValueOnce({ order })

    render(<AccountOrderDetails />)

    expect(screen.getByTestId('reject-modal-title')).toHaveTextContent(
      defaultOrderDetailsHeaderLabels.rejectModalTitle
    )
    expect(screen.getByTestId('reject-modal-message').textContent).toBe(
      defaultOrderDetailsHeaderLabels.rejectModalMessage
    )
    expect(screen.getByTestId('reject-modal-confirm')).toHaveTextContent(
      defaultOrderDetailsHeaderLabels.rejectModalConfirmText
    )
  })

  it('forwards CMS-provided reject modal labels to the order details header', () => {
    mockUseAccountPageData.mockReturnValueOnce({ order })

    render(
      <AccountOrderDetails
        rejectModalTitle="Rejeitar solicitação de aprovação"
        rejectModalMessage="Você está rejeitando a política {policy}."
        rejectModalConfirmText="Confirmar rejeição"
      />
    )

    expect(screen.getByTestId('reject-modal-title')).toHaveTextContent(
      'Rejeitar solicitação de aprovação'
    )
    expect(screen.getByTestId('reject-modal-message')).toHaveTextContent(
      'Você está rejeitando a política {policy}.'
    )
    expect(screen.getByTestId('reject-modal-confirm')).toHaveTextContent(
      'Confirmar rejeição'
    )
  })

  it('renders nothing when the page data has no order', () => {
    mockUseAccountPageData.mockReturnValueOnce({ order: null })

    const { container } = render(<AccountOrderDetails />)

    expect(container).toBeEmptyDOMElement()
  })
})
