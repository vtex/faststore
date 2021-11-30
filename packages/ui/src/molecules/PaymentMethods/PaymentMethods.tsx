import type { ReactNode, ReactNodeArray } from 'react'
import React from 'react'

import Label from '../../atoms/Label'

export interface PaymentMethodsProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Title of the payment methods section (e.g.: "Payment methods",
   * "Accepted Cards").
   */
  title?: ReactNode
  /**
   * An array with the flags to be displayed in the payment methods
   * section (e.g.:, visa, mastercard, etc).
   */
  flags?: ReactNodeArray
}

const PaymentMethods = ({
  testId = 'store-payment-methods',
  title,
  flags,
  children,
}: PaymentMethodsProps & { children: ReactNode }) => {
  return (
    <div data-store-payment-methods data-testid={testId}>
      <Label>{title}</Label>
      <div data-store-payment-methods-flags>{flags}</div>
      {children}
    </div>
  )
}

export default PaymentMethods
