import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * A React component that will be rendered as an icon.
   */
  component: ReactNode
}

const Icon = forwardRef<HTMLSpanElement, IconProps>(function Button(
  { component, testId = 'fs-icon', ...otherProps }: IconProps,
  ref
) {
  return (
    <span ref={ref} data-fs-icon data-testid={testId} {...otherProps}>
      {component}
    </span>
  )
})

export default Icon
