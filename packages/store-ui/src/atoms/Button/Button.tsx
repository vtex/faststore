import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react'
import React, { forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  href?: string
  disabled?: boolean
  as?: ElementType
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, as: Component = 'button', ...props },
  ref
) {
  const commonProps = {
    ref,
    'data-store-button': '',
    ...props,
  }

  return <Component {...commonProps}>{children}</Component>
})

export default Button
