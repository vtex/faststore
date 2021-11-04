import type { LabelHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { testId = 'store-label', children, ...otherProps },
  ref
) {
  return (
    <label ref={ref} data-store-label data-testid={testId} {...otherProps}>
      {children}
    </label>
  )
})

export default Label
