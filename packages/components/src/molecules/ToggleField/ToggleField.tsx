import React, { forwardRef } from 'react'
import { Label, SROnly, Toggle } from './../../'

export interface ToggleFieldProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * ID to identify input and corresponding label.
   */
  id: string
  /**
   * The text displayed to identify the input.
   */
  label: string
  /**
   * Controls whether the label will be displayed or not.
   */
  displayLabel?: boolean
  /**
   * Specifies that this input should be disabled.
   */
  disabled?: boolean
  /**
   * Controls the component's direction.
   */
  variant?: 'horizontal' | 'vertical'
}

const ToggleField = forwardRef<HTMLDivElement, ToggleFieldProps>(
  function ToggleField(
    {
      testId = 'fs-toggle-field',
      id,
      label,
      disabled,
      displayLabel = true,
      variant = 'horizontal',
      ...otherProps
    },
    ref
  ) {
    return (
      <div ref={ref} data-fs-toggle-field data-testid={testId}>
        <Toggle id={id} variant={variant} disabled={disabled} {...otherProps} />
        {displayLabel ? (
          <Label data-fs-toggle-field-label htmlFor={id}>
            {label}
          </Label>
        ) : (
          <SROnly text={label} />
        )}
      </div>
    )
  }
)

export default ToggleField
