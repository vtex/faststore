import type { ButtonHTMLAttributes, ElementType } from 'react'
import React, { forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Set the HTML element tag of this component.
   */
  as?: ElementType
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
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
