import type { ReactNode, AriaAttributes } from 'react'
import React, { forwardRef } from 'react'

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
   * Defines a string value that labels the current element when
   * title is not used.
   */
  'aria-label'?: AriaAttributes['aria-label']
  /**
   * Children will receive the flags to be displayed in the payment
   * methods section (e.g.:, visa, mastercard, etc).
   */
  children: ReactNode
}

const PaymentMethods = forwardRef<HTMLDivElement, PaymentMethodsProps>(
  function PaymentMethods(
    {
      testId = 'store-payment-methods',
      title,
      'aria-label': ariaLabel = 'Payment Methods',
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-store-payment-methods
        data-testid={testId}
        {...otherProps}
      >
        {!!title && <div id="payment-methods">{title}</div>}
        <div
          data-payment-methods-flags
          aria-label={title ? undefined : ariaLabel}
        >
          {children}
        </div>
      </div>
    )
  }
)

export default PaymentMethods
