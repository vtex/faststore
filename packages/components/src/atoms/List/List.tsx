import React from 'react'
import type { ElementType } from 'react'

import type {
  PolymorphicRef,
  PolymorphicComponentPropsWithRef,
} from '../../typings'
import { createPolymorphicComponent } from '../../utils'

interface BaseProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specify whether or not this component should display the list's markers (bullets or numbers).
   */
  marker?: boolean
}

export type ListProps<T extends ElementType = 'ul'> =
  PolymorphicComponentPropsWithRef<T, BaseProps>

const List = createPolymorphicComponent<'ul', BaseProps>(function List<
  C extends ElementType = 'ul',
>(
  { as, marker, testId = 'fs-list', ...otherProps }: ListProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = as ?? 'ul'

  return (
    <Component
      ref={ref}
      role="list"
      data-fs-list
      data-fs-list-marker={marker}
      data-testid={testId}
      {...otherProps}
    />
  )
})

export default List
