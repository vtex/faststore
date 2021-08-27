import type { HTMLAttributes, ElementType } from 'react'
import React, { forwardRef } from 'react'

export type ListVariant = 'default' | 'description' | 'ordered' | 'unordered'

const variantToType = (variant: ListVariant) => {
  switch (variant) {
    case 'description':
      return 'dl'

    case 'unordered':
      return 'ul'

    case 'ordered':
      return 'ol'

    default:
      return 'div'
  }
}

export interface ListProps extends HTMLAttributes<HTMLElement> {
  /**
   * Set the HTML element tag of this component.
   */
  as?: ElementType
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The current use case variants for Lists.
   */
  variant?: ListVariant
}

export const List = forwardRef<HTMLElement, ListProps>(function List(
  {
    testId = 'store-list',
    variant = 'default',
    as: Component = variantToType(variant),
    ...rawProps
  },
  ref
) {
  return (
    <Component
      ref={ref}
      data-store-list={variant}
      data-testid={testId}
      {...rawProps}
    />
  )
})

export default List
