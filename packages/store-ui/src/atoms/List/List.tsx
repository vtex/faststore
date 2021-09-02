import type { ElementType, ComponentPropsWithRef } from 'react'
import React, { forwardRef } from 'react'

export type ListVariant = 'description' | 'ordered' | 'unordered'

const variantToType = (variant: ListVariant) => {
  switch (variant) {
    case 'description':
      return 'dl'

    case 'unordered':
      return 'ul'

    case 'ordered':
      return 'ol'

    default:
      return 'ul'
  }
}

interface Props<C extends ElementType> {
  as?: C
  testId?: string
  variant?: ListVariant
}

export type ListProps<C extends ElementType> = Props<C> &
  Omit<ComponentPropsWithRef<C>, keyof Props<C>>

const List = forwardRef(function List<C extends ElementType = 'ul'>(
  {
    testId = 'store-list',
    variant = 'unordered',
    as,
    ...rawProps
  }: ListProps<C>,
  ref: ComponentPropsWithRef<C>['ref']
) {
  const dataAttributes = {
    'data-test-id': testId,
    'data-store-list': true,
    [`data-${variant}`]: true,
  }

  const Component = as ?? variantToType(variant)

  return (
    <Component
      ref={ref}
      data-testid={testId}
      {...dataAttributes}
      {...rawProps}
    />
  )
})

export default List
