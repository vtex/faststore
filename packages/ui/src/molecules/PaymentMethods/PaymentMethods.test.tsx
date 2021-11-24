import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import PaymentMethods from './PaymentMethods'

describe('Payment methods', () => {
  it('should have `data-store-payment-methods` attribute', () => {
    const { getByTestId } = render(<PaymentMethods>Testing</PaymentMethods>)

    expect(getByTestId('store-payment-methods')).toHaveAttribute(
      'data-store-payment-methods'
    )
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<PaymentMethods>Testing</PaymentMethods>)

      expect(
        await axe(getByTestId('store-payment-methods'))
      ).toHaveNoViolations()
    })
  })
})
