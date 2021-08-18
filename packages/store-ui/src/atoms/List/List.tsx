import type { HTMLAttributes, ElementType, ReactNode } from 'react'
import React, { forwardRef } from 'react'

export type ListVariant = 'default' | 'description' | 'ordered' | 'unordered'
export type ListFormatter = (List: number, variant: ListVariant) => ReactNode

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Set the HTML element tag of this component.
   */
  as?: ElementType
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The current use case variant for Lists.
   */
  variant?: ListVariant
}

export const List = forwardRef<HTMLDivElement, ListProps>(function List(
  {
    as: Component = 'div',
    children,
    testId = 'store-list',
    variant = 'default',
    ...rawProps
  },
  ref
) {
  const props = {
    [`data-${variant}`]: true,
    ...rawProps,
  }

  return (
    <Component ref={ref} data-store-List data-testid={testId} {...props}>
      {children}
    </Component>
  )
})

export default List
