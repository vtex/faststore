import type { ComponentProps } from 'react'

export interface ProductShelfItemProps extends ComponentProps<'li'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function ProductShelfItem({
  testId = 'fs-product-shelf-item',
  children,
  ref,
  ...otherProps
}: ProductShelfItemProps) {
  return (
    <li
      role="listitem"
      ref={ref}
      data-fs-product-shelf-item
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </li>
  )
}
