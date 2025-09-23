import type { ComponentProps } from 'react'

export interface ProductShelfItemsProps extends ComponentProps<'ul'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function ProductShelfItems({
  testId = 'fs-product-shelf-items',
  children,
  ref,
  ...otherProps
}: ProductShelfItemsProps) {
  return (
    <ul
      role="list"
      ref={ref}
      data-fs-product-shelf-items
      data-fs-content="product-shelf"
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </ul>
  )
}
