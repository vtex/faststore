import React, { forwardRef } from 'react'
import Checkbox, { CheckboxProps } from '../../atoms/Checkbox'
import Label from '../../atoms/Label'

export interface CheckboxFieldProps extends CheckboxProps {
  /**
   * The text displayed to identify the input checkbox.
   */
  label: string
}

const CheckboxField = forwardRef<HTMLDivElement, CheckboxFieldProps>(
  function CheckboxField(
    {
      testId = 'fs-checkbox-field',
      id,
      label,
      value,
      name,
      checked,
      ...otherProps
    },
    ref
  ) {
    return (
      <div ref={ref} data-fs-checkbox-field data-testid={testId}>
        <Checkbox
          id={id}
          value={value ?? label}
          name={name}
          defaultChecked={checked}
          {...otherProps}
        />
        <Label htmlFor={id}>{label}</Label>
      </div>
    )
  }
)

export default CheckboxField
