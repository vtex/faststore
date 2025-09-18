import React from 'react'
import type { ComponentProps } from 'react'

export interface ProductCardProps extends ComponentProps<'article'> {
  /**
   * Sets a border to the component.
   */
  bordered?: boolean
  /**
   * Sets the component's size.
   */
  variant?: 'wide' | 'default'
  /**
   * Enables a outOfStock status.
   */
  outOfStock?: boolean
  /**
   * ID to find this component in testing tools (e.g.: testing-library, and jest).
   */
  testId?: string
}

export default function ProductCard({
  testId = 'fs-product-card',
  variant = 'default',
  bordered = false,
  outOfStock,
  children,
  ref,
  ...otherProps
}: ProductCardProps) {
  return (
    <article
      ref={ref}
      data-fs-product-card={outOfStock ? 'out-of-stock' : ''}
      data-fs-product-card-variant={variant}
      data-fs-product-card-bordered={bordered}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </article>
  )
}
