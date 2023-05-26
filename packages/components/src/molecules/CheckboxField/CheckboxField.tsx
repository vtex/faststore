import React, { forwardRef } from 'react'
import Checkbox from '../../atoms/Checkbox'
import Label from '../../atoms/Label'

export interface CheckboxFieldProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * ID to identify input and corresponding label.
   */
  id: string
  /**
   * The text displayed to identify the input checkbox.
   */
  label: string
  /**
   * The value to identify the input checkbox.
   */
  value?: string
  /**
   * Identify checkbox in the same group.
   */
  name?: string
}

const CheckboxField = forwardRef<HTMLDivElement, CheckboxFieldProps>(
  function CheckboxField(
    { testId = 'fs-checkbox-field', id, label, value, name, ...otherProps },
    ref
  ) {
    return (
      <div ref={ref} data-fs-checkbox-field data-testid={testId}>
        <Checkbox id={id} value={value ?? label} name={name} {...otherProps} />
        <Label htmlFor={id}>{label}</Label>
      </div>
    )
  }
)

export default CheckboxField
