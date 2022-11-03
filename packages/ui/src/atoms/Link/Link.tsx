import type { ElementType, ReactElement } from 'react'
import React, { forwardRef } from 'react'

import type {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../typings'

interface Props {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

export type LinkProps<C extends ElementType> = PolymorphicComponentPropsWithRef<
  C,
  Props
>

type LinkComponent = <C extends ElementType = 'a'>(
  props: LinkProps<C>
) => ReactElement | null

const Link: LinkComponent = forwardRef(function Link<
  C extends ElementType = 'a'
>(
  { as, children, testId = 'store-link', ...otherProps }: LinkProps<C>,
  ref?: PolymorphicRef<C>
) {
  const Component = as ?? 'a'

  return (
    <Component ref={ref} data-fs-link data-testid={testId} {...otherProps}>
      {children}
    </Component>
  )
})

export default Link
