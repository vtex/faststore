import type { SelectHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface SelectProps<T = HTMLSelectElement>
  extends SelectHTMLAttributes<T> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { testId = 'store-select', ...props },
  ref
) {
  return <select ref={ref} data-store-select data-testid={testId} {...props} />
})

export default Select
