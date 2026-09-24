/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DeliveryOptionAccordionProduct } from '../../../../src/components/account/orders/OrderDetails/DeliveryOptionAccordion/DeliveryOptionAccordionProducts'
import { resolveOrderDeliveryLabels } from '../../../../src/components/account/orders/OrderDetails/orderDetailsLabels'

const labels = resolveOrderDeliveryLabels({
  eachLabel: 'Cada',
  taxesLabel: 'Impostos',
  totalLabel: 'Total traduzido',
})

describe('DeliveryOptionAccordionProduct', () => {
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
  })
})
