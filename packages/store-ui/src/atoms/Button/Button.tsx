import type { ButtonHTMLAttributes, ElementType } from 'react'
import React, { forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Specifies the URL of the page this button click goes to.
   */
  href?: string
  /**
   * Set the HTML element tag of this component.
   */
  as: ElementType
  /**
   * ID to find this component in Cypress tests.
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
