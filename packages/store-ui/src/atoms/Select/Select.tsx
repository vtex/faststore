/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { SelectHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { testId = 'store-select', children, ...props },
  ref
) {
  return (
    <select ref={ref} data-store-select data-testid={testId} {...props}>
      {children}
    </select>
  )
})

export default Select
