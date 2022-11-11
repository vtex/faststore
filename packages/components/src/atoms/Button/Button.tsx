import type { ButtonHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export type Color = 'primary' | 'secondary' | 'tertiary'
export type Size = 'small' | 'regular'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the component color variant.
   */
  color?: Color
  /**
   * Specifies the size variant.
   */
  size?: Size
  /**
   * Defines the use of inverted colors.
   */
  inverse?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    color,
    inverse,
    size = 'regular',
    testId = 'fs-button',
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
      {...otherProps}
    >
      {children}
    </button>
  )
})

export default Button
