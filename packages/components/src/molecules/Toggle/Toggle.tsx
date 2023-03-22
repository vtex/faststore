import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'
import { Icon, Input } from './../../'

export interface ToggleProps
  extends InputHTMLAttributes<Omit<HTMLInputElement, 'disabled' | 'type'>> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
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
  {
    testId = 'fs-toggle',
    id,
    disabled,
    variant = 'horizontal',
    ...otherProps
  }: ToggleProps,
  ref
) {
  return (
    <div data-fs-toggle data-fs-toggle-variant={variant} data-testid={testId}>
      <Input
        ref={ref}
        id={id}
        role="switch"
        type="checkbox"
        disabled={disabled}
        {...otherProps}
      />
      <span data-fs-toggle-knob>
        <Icon name="Checked" />
      </span>
    </div>
  )
})

export default Toggle
