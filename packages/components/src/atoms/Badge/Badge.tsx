import type { AriaAttributes, ComponentProps } from 'react'
import React from 'react'

export type BadgeVariants =
  | 'info'
  | 'highlighted'
  | 'success'
  | 'neutral'
  | 'warning'
  | 'danger'

export interface BadgeProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the size variant.
   */
  size?: 'small' | 'big'
  /**
   * Specifies the component variant.
   */
  variant?: BadgeVariants
  /**
   * Enables counter badge.
   */
  counter?: boolean
  /**
   * For accessibility purposes, adds an ARIA label to the element when `counter` is set to `true`.
   */
  'aria-label'?: AriaAttributes['aria-label']
}

export default function Badge({
  testId = 'fs-badge',
  size = 'small',
  variant = 'neutral',
  counter = false,
  'aria-label': ariaLabel,
  children,
  ref,
  ...otherProps
}: BadgeProps) {
  return (
    <div
      ref={ref}
      data-fs-badge
      aria-label={ariaLabel}
      data-fs-badge-variant={counter ? null : variant}
      data-fs-badge-size={size}
      data-fs-badge-counter={counter}
      data-testid={testId}
      {...otherProps}
    >
      <div data-fs-badge-wrapper>{children}</div>
    </div>
  )
}
