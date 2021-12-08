import React, { forwardRef } from 'react'
import type { HTMLAttributes, AriaAttributes } from 'react'

export interface IncentiveProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Defines a string value that labels the component.
   */
  'aria-label'?: AriaAttributes['aria-label']
}

const Incentive = forwardRef<HTMLDivElement, IncentiveProps>(function Incentive(
  {
    testId = 'store-incentive',
    'aria-label': ariaLabel,
    children,
    ...otherProps
  },
  ref
) {
  return (
    <div
      ref={ref}
      aria-label={ariaLabel}
      data-store-incentive
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </div>
  )
})

export default Incentive
