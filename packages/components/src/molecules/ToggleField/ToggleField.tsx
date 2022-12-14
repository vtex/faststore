import React from 'react'
import type { InputHTMLAttributes } from 'react'
import { Label, SROnly, Toggle } from './../../'

export interface ToggleFieldProps
  extends InputHTMLAttributes<Omit<HTMLInputElement, 'disabled' | 'type'>> {
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

const ToggleField = ({
  id,
  label,
  disabled,
  displayLabel = true,
  variant = 'horizontal',
  ...otherProps
}: ToggleFieldProps) => {
  return (
    <div data-fs-toggle-field>
      <Toggle id={id} {...otherProps} />
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

export default ToggleField
