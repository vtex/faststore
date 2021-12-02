import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'

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
   * Children will receive the flags to be displayed in the payment
   * methods section (e.g.:, visa, mastercard, etc).
   */
  children: ReactNode
}

const PaymentMethods = forwardRef<HTMLDivElement, PaymentMethodsProps>(
  function PaymentMethods(
    { testId = 'store-payment-methods', title, children },
    ref
  ) {
    return (
      <div ref={ref} data-store-payment-methods data-testid={testId}>
        <Label htmlFor="title">{title}</Label>
        <div id="flags" data-payment-methods-flags>
          {children}
        </div>
      </div>
    )
  }
)

export default PaymentMethods
