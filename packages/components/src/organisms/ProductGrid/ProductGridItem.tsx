import type { ComponentProps } from 'react'

export interface ProductGridItemProps extends ComponentProps<'li'> {
  /**
   * ID to find this component in testing tools (e.g.: Testing Library, and Jest).
   */
  testId?: string
}

export default function ProductGridItem({
  testId = 'fs-product-grid-item',
  children,
  ref,
  ...otherProps
}: ProductGridItemProps) {
  return (
    <li ref={ref} data-fs-product-grid-item {...otherProps}>
      {children}
    </li>
  )
}
