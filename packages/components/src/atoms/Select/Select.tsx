import React, { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { children, testId = 'fs-select', ...otherProps }: SelectProps,
  ref
) {
  return (
    <div>
      <select ref={ref} data-fs-select data-testid={testId} {...otherProps}>
        {children}
      </select>
    </div>
  )
})

export default Select
