import type { ButtonHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export type color = 'primary' | 'secondary' | 'tertiary'
export type size = 'small' | 'regular'
export type variant = 'link'

export interface ButtonProps<T = HTMLButtonElement>
  extends ButtonHTMLAttributes<T> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the component color variant.
   */
  color?: color
  /**
   * Specifies the size variant.
   */
  size?: size
  /**
   * Defines the use of inverted colors.
   */
  inverse?: boolean
  /**
   * Defines the type variant.
   */
  variant?: variant
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    testId = 'fs-button',
    inverse,
    size,
    color,
    variant,
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
      data-fs-button-color={color}
      data-fs-button-variant={variant}
      {...otherProps}
    >
      {children}
    </button>
  )
})

export default Button
