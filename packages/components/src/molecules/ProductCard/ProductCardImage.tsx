import type { ComponentProps } from 'react'
import type React from 'react'

export interface ProductCardImageProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the ProductCard image's aspect ratio.
   */
  aspectRatio?: number
}

export default function ProductCardImage({
  testId = 'fs-product-card-image',
  aspectRatio = 1,
  children,
  ref,
  ...otherProps
}: ProductCardImageProps) {
  return (
    <div
      ref={ref}
      data-fs-product-card-image
      data-testid={testId}
      style={
        {
          '--fs-product-card-image-aspect-ratio': aspectRatio,
        } as React.CSSProperties
      }
      {...otherProps}
    >
      {children}
    </div>
  )
}
