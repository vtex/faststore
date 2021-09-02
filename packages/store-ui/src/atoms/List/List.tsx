import type { ElementType, ReactElement, ComponentPropsWithRef } from 'react'
import React, { forwardRef } from 'react'

import type { PolymorphicComponentPropsWithRef } from '../../typings'

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

type ListPropsPolymorphic<
  C extends ElementType
> = PolymorphicComponentPropsWithRef<C>

type ListComponent = <C extends ElementType = 'ul'>(
  props: ListPropsPolymorphic<C>
) => ReactElement | null

export type ListProps<C extends ElementType = 'ul'> = ListPropsPolymorphic<C>

const List: ListComponent = forwardRef(function List<C extends ElementType>(
  {
    testId = 'store-list',
    variant = 'unordered',
    as,
    ...rawProps
  }: ListPropsPolymorphic<C>,
  ref: ComponentPropsWithRef<C>['ref']
) {
  const props = {
    [`data-store-list-${variant}`]: true,
    ...rawProps,
  }

  const Component = as ?? variantToType(variant)

  return <Component ref={ref} data-testid={testId} {...props} />
})

export default List
