/**
 * @vitest-environment jsdom
 */

import type { UserOrderDeliveryOptionsData } from '@generated/graphql'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import DeliveryCard from '../../../../src/components/account/orders/OrderDetails/DeliveryCard'

describe('DeliveryCard', () => {
  it('renders delivery options with localized CMS labels', () => {
    render(
      <DeliveryCard
        deliveryOptionsData={
          {
            deliveryOptions: [
              {
                selectedSla: 'Normal',
                deliveryChannel: 'delivery',
                shippingEstimate: '2bd',
                friendlyDeliveryOptionName: 'Delivery Up to 2 business days',
              },
            ],
          } as UserOrderDeliveryOptionsData
        }
        labels={{
          deliveryChannelLabel: 'Entrega',
          businessDaysOtherTemplate: 'Em até {count} dias úteis',
        }}
      />
    )

    expect(screen.getByText('Entrega Em até 2 dias úteis')).toBeTruthy()
  })
})
