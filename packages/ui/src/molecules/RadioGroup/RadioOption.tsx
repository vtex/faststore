import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import { Radio } from '../..'
import { useRadioOption } from './useRadioOption'

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
  /**
   * Children to show in radio.
   */
  children?: React.ReactNode
}

const RadioOption = forwardRef<HTMLInputElement, RadioOptionProps>(
  function RadioOption(
    { label, value, children, testId = 'store-radio-option', ...otherOptions },
    ref
  ) {
    const { name, value: option, onChange } = useRadioOption()

    const checked = value === option

    return (
      <label aria-label={label} data-store-radio-option>
        <Radio
          {...otherOptions}
          ref={ref}
          name={name}
          checked={checked}
          onChange={() => {
            onChange?.(value)
          }}
          testId={testId}
        />
        {children ?? <span>{label}</span>}
      </label>
    )
  }
)

export default RadioOption
