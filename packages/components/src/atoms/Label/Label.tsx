import React, { forwardRef } from 'react'
import type { LabelHTMLAttributes } from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { testId = 'fs-label', children, ...otherProps }: LabelProps,
  ref
) {
  return (
    <label ref={ref} data-fs-label data-testid={testId} {...otherProps}>
      {children}
    </label>
  )
})

export default Label
