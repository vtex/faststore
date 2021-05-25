import type { ButtonHTMLAttributes, ElementType } from 'react'
import React, { forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  as?: ElementType
  testId?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, as: Component = 'button', testId = 'store-button', ...props },
  ref
) {
  return (
    <Component ref={ref} data-store-button data-testid={testId} {...props}>
      {children}
    </Component>
  )
})

export default Button
