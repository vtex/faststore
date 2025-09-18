import type { AriaAttributes, ReactNode, Ref } from 'react'
import React from 'react'

import { Icon, List, SROnly } from '../../index'

type Flag = {
  icon: {
    icon: string
  }
  alt: string
}
export interface PaymentMethodsProps {
  /**
   * ID to find this component in testing tools (e.g.: testing-library, and jest).
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
   * List of flags to be displayed in the payment
   * methods section (e.g.:, visa, mastercard, etc).
   */
  flagList: Flag[]
  /**
   * Component ref
   */
  ref?: Ref<HTMLDivElement>
}

export default function PaymentMethods({
  testId = 'fs-payment-methods',
  title,
  'aria-label': ariaLabel = 'Payment Methods',
  flagList,
  ref,
  ...otherProps
}: PaymentMethodsProps) {
  return (
    <div
      ref={ref}
      data-fs-payment-methods
      data-testid={testId}
      aria-labelledby={title ? 'payment-methods-title' : 'Payment Methods'}
      {...otherProps}
    >
      {/* TODO: We can consider removing and make title always required or add it via heading */}
      {!!title && (
        <div data-fs-payment-methods-title id="payment-methods-title">
          {title}
        </div>
      )}
      <List
        data-fs-payment-methods-flags
        aria-label={title ? undefined : ariaLabel}
      >
        {flagList.map(({ alt: text, icon: { icon } }, index) => (
          <li
            data-fs-payment-methods-flag
            key={`fs-payment-method-${index}-${text}`}
          >
            <Icon width={28} height={18} name={icon} />
            {text && <SROnly text={text} />}
          </li>
        ))}
      </List>
    </div>
  )
}
