import React, { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { Icon } from '../..'
import { CaretDown } from '@faststore/ui/src/assets'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Assigns an identifier to link the UISelect component and its label.
   */
  id: string
  /**
   * Defines the options available in the select. The SelectOptions object
   * keys are the property names, while the values correspond to the text that
   * will be displayed in the UI.
   */
  options: Record<string, string>
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, id, testId = 'fs-select', ...otherProps }: SelectProps,
  ref
) {
  return (
    <div data-fs-select>
      <select id={id} ref={ref} data-testid={testId} {...otherProps}>
        {Object.keys(options).map((key) => (
          <option key={key} value={key}>
            {options[key]}
          </option>
        ))}
      </select>
      <Icon data-fs-select-icon component={<CaretDown />}/>
    </div>
  )
})

export default Select
