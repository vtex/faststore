import type { ButtonHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export type Variant = 'primary' | 'secondary' | 'tertiary'
export type Size = 'small' | 'regular'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the component color variant.
   */
  variant?: Variant
  /**
   * Specifies the size variant.
   */
  size?: Size
  /**
   * Defines the use of inverted colors.
   */
  inverse?: boolean
  /**
   * Specifies that this button should be disabled
   */
  disabled?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant,
    inverse,
    size = 'regular',
    testId = 'fs-button',
    disabled,
    ...otherProps
  },
  ref
) {
  return (
    <button
      ref={ref}
      data-testid={testId}
      data-fs-button
      data-fs-button-inverse={inverse}
      data-fs-button-size={size}
      data-fs-button-variant={variant}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </button>
  )
})

export default Button
