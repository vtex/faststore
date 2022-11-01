import type { ReactNode, HTMLAttributes, AriaAttributes } from 'react'
import React, { forwardRef } from 'react'

export type BadgeVariants =
  | 'info'
  | 'highlighted'
  | 'success'
  | 'neutral'
  | 'warning'
  | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Sets the component's size.
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
   * For accessibility purposes, defines an ARIA label to the element when counter badge
   */
  'aria-label'?: AriaAttributes['aria-label']
  children?: ReactNode
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  {
    testId = 'store-badge',
    size = 'small',
    variant = 'neutral',
    counter = false,
    'aria-label': ariaLabel,
    children,
    ...otherProps
  }: BadgeProps,
  ref
) {
  return (
    <div
      ref={ref}
      data-fs-badge
      data-testid={testId}
      aria-label={ariaLabel}
      data-fs-variant={counter ? null : variant}
      data-fs-badge-size={size}
      data-fs-badge-counter={counter}
      {...otherProps}
    >
      <div data-fs-badge-wrapper>
        <span>{children}</span>
      </div>
    </div>
  )
})

export default Badge
