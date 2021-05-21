import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  component: ReactNode
}

const Icon = forwardRef<HTMLSpanElement, IconProps>(function Button(
  { component, ...props }: IconProps,
  ref
) {
  return (
    <span ref={ref} data-store-icon {...props}>
      {component}
    </span>
  )
})

export default Icon
