import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import Label from '../../atoms/Label'
import Radio from '../../atoms/Radio'

export interface RadioFieldProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * ID to identify input and corresponding label.
   */
  id: string
  /**
   * The text or component displayed to identify the input radio.
   */
  label: string | ReactNode
  /**
   * The value to identify the input radio.
   */
  value?: string
  /**
   * Identify radio in the same group.
   */
  name?: string
}

const RadioField = forwardRef<HTMLDivElement, RadioFieldProps>(
  function RadioField(
    { testId = 'fs-radio-field', id, label, value, name, ...otherProps },
    ref
  ) {
    return (
      <div ref={ref} data-fs-radio-field data-testid={testId}>
        <Radio
          id={id}
          value={typeof label === 'string' ? label : value}
          name={name}
          {...otherProps}
        />
        <Label htmlFor={id}>{label}</Label>
      </div>
    )
  }
)

export default RadioField
