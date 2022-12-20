import type { ReactNode, ButtonHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'
import { Icon } from '../../index'

export type Variant = 'primary' | 'secondary' | 'tertiary'
export type Size = 'small' | 'regular'
export type IconPosition = 'left' | 'right'

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
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
  /**
   * Specifies where the icon should be positioned
   */
  iconPosition?: IconPosition
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant,
    inverse,
    size = 'regular',
    testId = 'fs-button',
    icon,
    iconPosition = 'left',
    disabled,
    ...otherProps
  },
  ref
) {
  return (
    <button
      ref={ref}
      data-fs-button
      data-fs-button-inverse={inverse}
      data-fs-button-size={size}
      data-fs-button-variant={variant}
      disabled={disabled}
      data-testid={testId}
      {...otherProps}
    >
      {icon && iconPosition === 'left' && <Icon component={icon} />}
      {children}
      {icon && iconPosition === 'right' && <Icon component={icon} />}
    </button>
  )
})

export default Button
