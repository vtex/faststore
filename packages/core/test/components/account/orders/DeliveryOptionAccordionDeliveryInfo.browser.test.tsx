/**
 * @vitest-environment jsdom
 */

import type { UserOrderDeliveryOption } from '@generated/graphql'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import DeliveryOptionAccordionDeliveryInfo from '../../../../src/components/account/orders/OrderDetails/DeliveryOptionAccordion/DeliveryOptionAccordionDeliveryInfo'
import { resolveOrderDeliveryLabels } from '../../../../src/components/account/orders/OrderDetails/orderDetailsLabels'

const labels = resolveOrderDeliveryLabels({
  recipientLabel: 'Destinatário',
  deliveryAddressLabel: 'Endereço de entrega',
})

describe('DeliveryOptionAccordionDeliveryInfo', () => {
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
})
