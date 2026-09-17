/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { UserOrderDeliveryOption } from '@generated/graphql'

import DeliveryOptionAccordionDeliveryInfo from '../../../../src/components/account/orders/OrderDetails/DeliveryOptionAccordion/DeliveryOptionAccordionDeliveryInfo'
import { DeliveryOptionAccordionProduct } from '../../../../src/components/account/orders/OrderDetails/DeliveryOptionAccordion/DeliveryOptionAccordionProducts'
import {
  defaultOrderDeliveryLabels,
  resolveOrderDeliveryLabels,
} from '../../../../src/components/account/orders/OrderDetails/orderDetailsLabels'

const labels = resolveOrderDeliveryLabels({
  recipientLabel: 'Destinatário',
  deliveryAddressLabel: 'Endereço de entrega',
  eachLabel: 'Cada',
  taxesLabel: 'Impostos',
  totalLabel: 'Total traduzido',
})

describe('delivery option labels', () => {
  it('renders localized recipient and delivery address labels', () => {
    render(
      <DeliveryOptionAccordionDeliveryInfo
        deliveryOption={
          {
            deliveryChannel: 'delivery',
            address: {
              city: 'Rio de Janeiro',
              street: 'Rua Um',
              postalCode: '20000-000',
              state: 'RJ',
              country: 'BRA',
            },
          } as UserOrderDeliveryOption
        }
        contact={{ name: 'Maria' }}
        labels={labels}
      />
    )

    expect(screen.getByText('Destinatário')).toBeTruthy()
    expect(screen.getByText('Endereço de entrega')).toBeTruthy()
  })

  it('renders localized product price labels', () => {
    render(
      <DeliveryOptionAccordionProduct
        image=""
        quantity={1}
        name="Produto"
        price="R$ 10,00"
        tax="R$ 1,00"
        total="R$ 11,00"
        labels={labels}
      />
    )

    expect(screen.getByText('Cada')).toBeTruthy()
    expect(screen.getByText('Impostos')).toBeTruthy()
    expect(screen.getByText('Total traduzido')).toBeTruthy()
    expect(defaultOrderDeliveryLabels.eachLabel).toBe('Each')
  })
})
