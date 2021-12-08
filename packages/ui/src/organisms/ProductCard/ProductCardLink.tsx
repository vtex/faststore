import React from 'react'
import type { AnchorHTMLAttributes, PropsWithChildren } from 'react'

export interface ProductCardLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The URL the link points to
   */
  href: string
}

const ProductCardLink = ({
  href,
  children,
  testId = 'store-product-card-link',
  ...otherProps
}: PropsWithChildren<ProductCardLinkProps>) => {
  return (
    <a
      href={href}
      data-testid={testId}
      data-store-product-card-link
      {...otherProps}
    >
      {children}
    </a>
  )
}

export default ProductCardLink
