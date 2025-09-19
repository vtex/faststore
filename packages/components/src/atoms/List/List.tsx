import type { ElementType } from 'react'

import type { PolymorphicComponentPropsWithRef } from '../../typings'

interface BaseProps {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Specify whether or not this component should display the list's markers (bullets or numbers).
   */
  marker?: boolean
}

export type ListProps<T extends ElementType = 'ul'> =
  PolymorphicComponentPropsWithRef<T, BaseProps>

export default function List<T extends ElementType = 'ul'>({
  as,
  marker,
  testId = 'fs-list',
  ref,
  ...otherProps
}: ListProps<T>) {
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
}
