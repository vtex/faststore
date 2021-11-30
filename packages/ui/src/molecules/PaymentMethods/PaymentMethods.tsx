import type { ReactNode } from 'react'
import React from 'react'

import Label from '../../atoms/Label'

export interface PaymentMethodsProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  title?: ReactNode
}

const PaymentMethods = ({
  testId = 'store-payment-methods',
  title,
  children,
}: PaymentMethodsProps & { children: ReactNode }) => {
  return (
    <div data-store-payment-methods data-testid={testId}>
      <Label>{title}</Label>
      {children}
    </div>
  )
}

export default PaymentMethods
