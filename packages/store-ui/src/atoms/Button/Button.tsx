import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'

export type ButtonProps = {
  children: ReactNode
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, ...props },
  ref
) {
  const commonProps = {
    ref,
    'data-store-button': '',
    ...props,
  }

  return <button {...commonProps}>{children}</button>
})

export default Button
