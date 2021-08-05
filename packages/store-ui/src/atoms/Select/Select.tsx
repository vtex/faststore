import type { SelectHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface SelectProps<T = HTMLSelectElement>
  extends SelectHTMLAttributes<T> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * List of key-value pairs representing the component's options
   */
  options?: string[][]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { testId = 'store-select', options, ...props },
  ref
) {
  return (
    <select ref={ref} data-store-select data-testid={testId} {...props}>
      {options?.map(([value, label]) => {
        return (
          <option key={value} value={value}>
            {label}
          </option>
        )
      })}
    </select>
  )
})

export default Select
