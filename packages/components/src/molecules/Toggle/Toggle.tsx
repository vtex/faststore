import type { ComponentProps } from 'react'
import { Icon, Input } from './../../'

export interface ToggleProps
  extends Omit<ComponentProps<'input'>, 'type' | 'disabled'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
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

export default function Toggle({
  testId = 'fs-toggle',
  id,
  disabled,
  variant = 'horizontal',
  ref,
  ...otherProps
}: ToggleProps) {
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
}
