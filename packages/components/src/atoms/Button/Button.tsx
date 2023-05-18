import type { ButtonHTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'
import { Loader } from '../../'

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
   * Specifies that this button should be disabled.
   */
  disabled?: boolean
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
  /**
   * Boolean that represents a loading state.
   */
  loading?: boolean
  /**
   * Specifies a label for loading state.
   */
  loadingLabel?: string
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
    loading,
    loadingLabel,
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
      data-fs-button-loading={loading}
      data-fs-button-variant={variant}
      disabled={disabled}
      data-testid={testId}
      {...otherProps}
    >
      <div data-fs-button-wrapper>
        {loading && (
          <p data-fs-button-loading-label>
            {loadingLabel}
            <Loader
              variant={variant === 'primary' && !inverse ? 'light' : 'dark'}
            />
          </p>
        )}
        {!!icon && iconPosition === 'left' && (
          <span data-fs-button-icon>{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!!icon && iconPosition === 'right' && (
          <span data-fs-button-icon>{icon}</span>
        )}
      </div>
    </button>
  )
})

export default Button
