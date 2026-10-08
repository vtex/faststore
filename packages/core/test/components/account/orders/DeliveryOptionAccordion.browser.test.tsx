/**
 * @vitest-environment jsdom
 */

import type { UserOrderDeliveryOption } from '@generated/graphql'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DeliveryOptionAccordion } from '../../../../src/components/account/orders/OrderDetails/DeliveryOptionAccordion'

vi.mock('next/router', () => ({
  useRouter: () => ({ locale: 'pt-BR' }),
}))

const deliveryOption = {
  selectedSla: 'Normal',
  deliveryChannel: 'delivery',
  shippingEstimate: '2bd',
  friendlyDeliveryOptionName: 'Delivery Up to 2 business days',
  quantityOfDifferentItems: 1,
  total: 1100,
  address: {
    city: 'Rio de Janeiro',
    street: 'Rua Um',
    postalCode: '20000-000',
    state: 'RJ',
    country: 'BRA',
  },
  items: [
    {
      uniqueId: 'item-1',
      name: 'Produto',
      imageUrl: '',
      quantity: 1,
      sellingPrice: 1000,
      tax: 100,
      total: 1100,
    },
  ],
} as unknown as UserOrderDeliveryOption

describe('DeliveryOptionAccordion', () => {
  it('renders the localized delivery option title and summary', () => {
    render(
      <DeliveryOptionAccordion
        deliveryOption={deliveryOption}
        currencyCode="BRL"
        labels={{
          deliveryChannelLabel: 'Entrega',
          businessDaysOtherTemplate: 'Em até {count} dias úteis',
          itemCountTemplate: '{count} item',
          totalLabel: 'Total traduzido',
        }}
      />
    )

    expect(screen.getByText('Entrega Em até 2 dias úteis')).toBeTruthy()
    expect(
      screen.getByText(/1 item – Total traduzido/, { exact: false })
    ).toBeTruthy()
  })

  it('forwards the resolved labels to the delivery info and product panels', () => {
    render(
      <DeliveryOptionAccordion
        deliveryOption={deliveryOption}
        contact={{ name: 'Maria' }}
        currencyCode="BRL"
        labels={{ recipientLabel: 'Destinatário', eachLabel: 'Cada' }}
      />
    )

    expect(screen.getByText('Destinatário')).toBeTruthy()
    expect(screen.getByText('Cada')).toBeTruthy()
  })
})
