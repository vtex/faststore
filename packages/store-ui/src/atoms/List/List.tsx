import type { ElementType, ComponentPropsWithRef, ReactElement } from 'react'
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

interface Props {
  testId?: string
  variant?: ListVariant
}

export type ListProps<C extends ElementType> = PolymorphicComponentPropsWithRef<
  C,
  Props
>

type ListComponent = <C extends ElementType = 'ul'>(
  props: ListProps<C>
) => ReactElement | null

const List: ListComponent = forwardRef(function List<
  C extends ElementType = 'ul'
>(
  {
    testId = 'store-list',
    variant = 'unordered',
    as,
    ...rawProps
  }: ListProps<C>,
  ref: ComponentPropsWithRef<C>['ref']
) {
  const dataAttributes = {
    'data-testid': testId,
    'data-store-list': true,
    [`data-${variant}`]: true,
  }

  const Component = as ?? variantToType(variant)

  return <Component ref={ref} {...dataAttributes} {...rawProps} />
})

export default List
