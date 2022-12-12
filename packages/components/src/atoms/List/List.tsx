import React, { forwardRef } from 'react'
import type { ElementType, ReactElement } from 'react'

import type {
  PolymorphicRef,
  PolymorphicComponentPropsWithRef,
} from '../../typings'

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

export type ListProps<T extends ElementType> = PolymorphicComponentPropsWithRef<
  T,
  BaseProps
>

type ListComponent = <T extends ElementType = 'ul'>(
  props: ListProps<T>
) => ReactElement | null

const List: ListComponent = forwardRef(function List<
  T extends ElementType = 'ul'
>(
  { as, marker, testId = 'fs-list', ...otherProps }: ListProps<T>,
  ref: PolymorphicRef<T>
) {
  const Component = as ?? 'ul'

  return (
    <Component
      ref={ref}
      data-fs-list
      data-testid={testId}
      data-fs-list-marker={marker}
      {...otherProps}
    />
  )
})

export default List
