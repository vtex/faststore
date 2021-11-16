import React from 'react'

export interface PaymentMethodsProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const PaymentMethods = ({
  testId = 'store-payment-methods',
}: PaymentMethodsProps) => {
  return <div data-testid={testId}>Payment Methods</div>
}

export default PaymentMethods
