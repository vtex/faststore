import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { testId = 'fs-checkbox', ...otherProps }: CheckboxProps,
  ref
) {
  return (
    <input
      ref={ref}
      data-fs-checkbox
      data-testid={testId}
      type="checkbox"
      {...otherProps}
    />
  )
})

export default Checkbox
