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

  it('Should render PaymentMethods Children', () => {
    const { getByTestId } = render(
      <PaymentMethods title="Payment Methods">
        <h3>I am a flag</h3>
      </PaymentMethods>
    )

    expect(getByTestId('store-payment-methods')).toHaveTextContent(
      'I am a flag'
    )
  })

  it('Should render PaymentMethods title', () => {
    const { getByTestId } = render(
      <PaymentMethods title="I am a title">Testing</PaymentMethods>
    )

    expect(getByTestId('store-payment-methods')).toHaveTextContent(
      'I am a title'
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
