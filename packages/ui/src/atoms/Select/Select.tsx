import type { SelectHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { children, testId = 'store-select', ...otherProps },
  ref
) {
  return (
    <select ref={ref} data-store-select data-testid={testId} {...otherProps}>
      {children}
    </select>
  )
})

export default Select
