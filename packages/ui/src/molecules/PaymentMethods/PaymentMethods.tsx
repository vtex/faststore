import React from 'react'

export interface PaymentMethodsProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  children: React.ReactNode
}

const PaymentMethods = ({
  testId = 'store-payment-methods',
  children,
}: PaymentMethodsProps) => {
  return (
    <div data-store-payment-methods data-testid={testId}>
      {children}
    </div>
  )
}

export default PaymentMethods
