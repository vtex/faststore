import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockUseAccountPageData = vi.hoisted(() => vi.fn())

vi.mock('next/router', () => ({ useRouter: () => ({ locale: 'pt-BR' }) }))
vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountPageData: mockUseAccountPageData,
}))

import AccountOrderStatus from 'src/components/sections/Account/AccountOrderStatus'

const order = {
  status: 'payment-approved',
  creationDate: '2026-08-05T18:30:00.000Z',
}

afterEach(cleanup)

describe('AccountOrderStatus', () => {
  it('renders the timeline with the default labels', () => {
    mockUseAccountPageData.mockReturnValueOnce({ order })

    render(<AccountOrderStatus />)

    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Order placed')).toBeInTheDocument()
    expect(screen.getByText('Handling order')).toBeInTheDocument()
  })

  it('forwards the CMS labels to the status card', () => {
    mockUseAccountPageData.mockReturnValueOnce({ order })

    render(
      <AccountOrderStatus
        statusTitle="Status do pedido"
        orderPlacedStep="Pedido realizado"
        approvedStep="Aprovado"
        handlingStep="Em separação"
        shipOrderStep="Enviar pedido"
      />
    )

    expect(screen.getByText('Status do pedido')).toBeInTheDocument()
    expect(screen.getByText('Pedido realizado')).toBeInTheDocument()
    expect(screen.getByText('Aprovado')).toBeInTheDocument()
    expect(screen.getByText('Em separação')).toBeInTheDocument()
    expect(screen.getByText('Enviar pedido')).toBeInTheDocument()
  })

  it('renders nothing when the page data has no order', () => {
    mockUseAccountPageData.mockReturnValueOnce({ order: null })

    const { container } = render(<AccountOrderStatus />)

    expect(container).toBeEmptyDOMElement()
  })
})
