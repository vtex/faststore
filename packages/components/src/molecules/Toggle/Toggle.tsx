import React, { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Input, Icon } from './../../'
import { Checked } from '../../assets'

export interface ToggleProps
  extends InputHTMLAttributes<Omit<HTMLInputElement, 'disabled' | 'type'>> {
  /**
   * ID to identify input and corresponding label.
   */
  id: string
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
  { id, disabled, variant = 'horizontal', ...otherProps }: ToggleProps,
  ref
) {
  return (
    <div data-fs-toggle data-fs-toggle-variant={variant}>
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
  )
})

export default Toggle
