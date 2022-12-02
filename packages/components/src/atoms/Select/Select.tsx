import React, { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { Icon } from '../..'
import { CaretDown } from '@faststore/ui/src/assets'

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
    <div data-fs-select>
      <select ref={ref} data-testid={testId} {...otherProps}>
        {children}
      </select>
      <Icon data-fs-select-icon component={<CaretDown />}/>
    </div>
  )
})

export default Select
