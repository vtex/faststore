import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import Radio from '../../atoms/Radio'
import { useRadioGroup } from './useRadioGroup'

export interface RadioOptionProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Attribute to set aria-label option as required.
   */
  label: string
  /**
   * Value to be emitted when radio is clicked.
   */
  value: string | number
}

const RadioOption = forwardRef<HTMLInputElement, RadioOptionProps>(
  function RadioOption(
    { label, value, children, testId = 'fs-radio-group-option', ...otherProps },
    ref
  ) {
    const { name, selectedValue, onChange } = useRadioGroup()

    return (
      <label aria-label={label} data-fs-radio-group-option>
        <Radio
          data-fs-radio-option-item
          ref={ref}
          name={name}
          checked={value === selectedValue}
          onChange={onChange}
          value={value}
          testId={testId}
          {...otherProps}
        />
        {children}
      </label>
    )
  }
)

export default RadioOption
