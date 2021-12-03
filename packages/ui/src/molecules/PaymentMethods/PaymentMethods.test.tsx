import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import PaymentMethods from './PaymentMethods'

describe('Payment methods', () => {
  let paymentMethodsData: HTMLElement

  beforeEach(() => {
    const { getByTestId } = render(
      <PaymentMethods title="I am a title">
        <h3>I am a flag</h3>
      </PaymentMethods>
    )

    paymentMethodsData = getByTestId('store-payment-methods')
  })

  it('should have `data-store-payment-methods` attribute', () => {
    expect(paymentMethodsData).toHaveAttribute('data-store-payment-methods')
  })

  it('Should render PaymentMethods Children', () => {
    expect(paymentMethodsData).toHaveTextContent('I am a flag')
  })

  it('Should render PaymentMethods title', () => {
    expect(paymentMethodsData).toHaveTextContent('I am a title')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      expect(await axe(paymentMethodsData)).toHaveNoViolations()
    })
  })
})
