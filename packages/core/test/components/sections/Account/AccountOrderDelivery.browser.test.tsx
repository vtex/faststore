import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockUseAccountPageData = vi.hoisted(() => vi.fn())

vi.mock('next/router', () => ({ useRouter: () => ({ locale: 'pt-BR' }) }))
vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountPageData: mockUseAccountPageData,
}))

import AccountOrderDelivery from 'src/components/sections/Account/AccountOrderDelivery'

const order = {
  storePreferencesData: { currencyCode: 'BRL' },
  customFields: [],
  deliveryOptionsData: {
    contact: { name: 'Maria' },
    deliveryOptions: [
      {
        selectedSla: 'Normal',
        deliveryChannel: 'delivery',
        shippingEstimate: '2bd',
        friendlyDeliveryOptionName: 'Delivery Up to 2 business days',
        quantityOfDifferentItems: 1,
        total: 1100,
        items: [],
        address: {
          city: 'Rio de Janeiro',
          street: 'Rua Um',
          postalCode: '20000-000',
          state: 'RJ',
          country: 'BRA',
        },
      },
    ],
  },
}

afterEach(() => {
  cleanup()
  mockUseAccountPageData.mockReset()
})

describe('AccountOrderDelivery', () => {
  it('forwards the CMS labels to the delivery card and accordions', () => {
    mockUseAccountPageData.mockReturnValue({ order })

    render(
      <AccountOrderDelivery
        deliveryTitle="Entrega do pedido"
        deliveryChannelLabel="Entrega"
        businessDaysOtherTemplate="Em até {count} dias úteis"
        recipientLabel="Destinatário"
      />
    )

    expect(screen.getByText('Entrega do pedido')).toBeInTheDocument()
    expect(screen.getAllByText('Entrega Em até 2 dias úteis')).toHaveLength(2)
    expect(screen.getByText('Destinatário')).toBeInTheDocument()
  })

  it('renders nothing when the order has no delivery data', () => {
    mockUseAccountPageData.mockReturnValue({
      order: { ...order, deliveryOptionsData: null },
    })

    const { container } = render(<AccountOrderDelivery />)

    expect(container).toBeEmptyDOMElement()
  })
})
