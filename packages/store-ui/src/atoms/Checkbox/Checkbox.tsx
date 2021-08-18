import React, { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { testId = 'store-checkbox', ...props }: CheckboxProps,
  ref
) {
  return (
    <input
      ref={ref}
      data-store-checkbox
      data-testid={testId}
      type="checkbox"
      {...props}
    />
  )
})

export default Checkbox
