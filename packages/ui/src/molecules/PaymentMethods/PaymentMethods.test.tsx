import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import PaymentMethods from './PaymentMethods'

const TestPaymentMethods = () => <PaymentMethods />

describe('Payment methods', () => {
  it('should have `data-store-payment-methods` attribute', () => {
    const { getByTestId } = render(<TestPaymentMethods />)

    expect(getByTestId('store-payment-methods')).toHaveAttribute(
      'data-store-payment-methods'
    )
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<TestPaymentMethods />)

      expect(
        await axe(getByTestId('store-payment-methods'))
      ).toHaveNoViolations()
    })
  })
})
