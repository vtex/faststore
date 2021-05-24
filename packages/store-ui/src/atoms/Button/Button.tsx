import type { ButtonHTMLAttributes, ElementType } from 'react'
import React, { forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  as?: ElementType
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, as: Component = 'button', ...props },
  ref
) {
  return (
    <Component ref={ref} data-store-button {...props}>
      {children}
    </Component>
  )
})

export default Button
