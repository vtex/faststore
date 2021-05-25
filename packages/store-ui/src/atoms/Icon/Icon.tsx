import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  component: ReactNode
  testId?: string
}

const Icon = forwardRef<HTMLSpanElement, IconProps>(function Button(
  { component, testId = 'store-icon', ...props }: IconProps,
  ref
) {
  return (
    <span ref={ref} data-store-icon data-testid={testId} {...props}>
      {component}
    </span>
  )
})

export default Icon
