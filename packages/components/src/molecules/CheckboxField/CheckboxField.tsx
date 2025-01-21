import React, { forwardRef } from 'react'
import Checkbox, { type CheckboxProps } from '../../atoms/Checkbox'
import Label from '../../atoms/Label'

export interface CheckboxFieldProps extends CheckboxProps {
  /**
   * The text displayed to identify the input checkbox.
   */
  label: string
  /**
   * The error message is displayed when an error occurs.
   */
  error?: string
  /**
   * Control the vertical alignment of the checkbox in relation to the label (center, top, bottom).
   */
  alignment?: 'center' | 'top' | 'bottom'
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
      error,
      disabled,
      alignment = 'center',
      ...otherProps
    },
    ref
  ) {
    const shouldDisplayError = !disabled && error && error !== ''

    return (
      <div
        ref={ref}
        data-testid={testId}
        data-fs-checkbox-field
        data-fs-checkbox-field-error={error && error !== ''}
        data-fs-checkbox-field-alignment={alignment}
      >
        <Checkbox
          id={id}
          value={value ?? label}
          name={name}
          defaultChecked={checked}
          disabled={disabled}
          {...otherProps}
        />
        <div data-fs-checkbox-field-content>
          <Label htmlFor={id}>{label}</Label>

          {shouldDisplayError && (
            <span data-fs-checkbox-field-error-message>{error}</span>
          )}
        </div>
      </div>
    )
  }
)

export default CheckboxField
