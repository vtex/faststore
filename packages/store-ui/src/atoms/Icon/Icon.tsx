import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  component: ReactNode
}

const Icon = forwardRef<HTMLSpanElement, IconProps>(function Button(
  { component, ...props }: IconProps,
  ref
) {
  const commonProps = {
    ref,
    'data-store-icon': '',
    ...props,
  }

  return <span {...commonProps}>{component}</span>
})

export default Icon
