import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * A React component that will be rendered as an icon.
   */
  component: ReactNode
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Icon = forwardRef<HTMLSpanElement, IconProps>(function Button(
  { component, testId = 'store-icon', ...otherProps }: IconProps,
  ref
) {
  return (
    <span ref={ref} data-store-icon data-testid={testId} {...otherProps}>
      {component}
    </span>
  )
})

export default Icon
