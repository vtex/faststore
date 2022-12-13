import React, { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Input, Label, Icon, SROnly } from './../../'
import { Checked } from '../../assets'

export interface ToggleProps
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

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  {
    id,
    label,
    disabled,
    displayLabel = true,
    variant = 'horizontal',
    ...otherProps
  }: ToggleProps,
  ref
) {
  return (
    <div data-fs-toggle data-fs-toggle-variant={variant}>
      <div data-fs-toggle-container>
        <Input
          id={id}
          ref={ref}
          role="switch"
          type="checkbox"
          disabled={disabled}
          {...otherProps}
        />
        <span data-fs-toggle-knob>
          <Icon component={<Checked />} />
        </span>
      </div>
      {displayLabel ? (
        <Label data-fs-label htmlFor={id}>
          {label}
        </Label>
      ) : (
        <SROnly text={label} />
      )}
    </div>
  )
})

export default Toggle
