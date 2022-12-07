import React, { forwardRef } from 'react'
import type { ElementType, HTMLAttributes } from 'react'

const variantToElement = {
  unordered: 'ul',
  ordered: 'ol',
}

export interface ListProps<T = HTMLElement> extends HTMLAttributes<T> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  as?: ElementType
  variant?: 'ordered' | 'unordered'
  marker?: boolean
}

const List = forwardRef<HTMLUListElement, ListProps>(function List(
  {
    testId = 'fs-list',
    as: MaybeComponent,
    variant = 'unordered',
    marker = false,
    ...otherProps
  },
  ref
) {

  const Component = MaybeComponent ?? variantToElement[variant] ?? 'ul'

  return (
    <Component
      ref={ref}
      data-fs-list
      data-testid={testId}
      data-fs-list-variant={variant}
      data-fs-list-marker={marker}
      {...otherProps}
    />
  )
})

export default List
