import React, { forwardRef } from 'react'
import type { ElementType, HTMLAttributes } from 'react'

const variantToElement = {
  description: 'dl',
  unordered: 'ul',
  ordered: 'ol',
}

export interface ListProps<T = HTMLElement> extends HTMLAttributes<T> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  variant?: 'description' | 'ordered' | 'unordered'
  as?: ElementType
}

const List = forwardRef<HTMLUListElement, ListProps>(function List(
  {
    testId = 'store-list',
    variant = 'unordered',
    as: MaybeComponent,
    ...otherProps
  },
  ref
) {
  const dataAttributes = {
    'data-testid': testId,
    'data-store-list': variant,
  }

  const Component = MaybeComponent ?? variantToElement[variant] ?? 'ul'

  return <Component ref={ref} {...dataAttributes} {...otherProps} />
})

export default List
