import React, { forwardRef } from 'react'
import type { FC, ElementType } from 'react'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../typings'

type LinkBaseProps = {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

export type LinkElementType = ElementType

export type LinkProps<C extends LinkElementType = 'a'> =
  PolymorphicComponentPropsWithRef<C, LinkBaseProps>

const Link = forwardRef(function Link<C extends LinkElementType = 'a'>(
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

//  This is only being exported to make it easier to use in Storybook.
//  **DON'T** import this directly to use this component, use the default export
//  instead.

export const StorybookLink = Link as FC<LinkBaseProps>

export default Link
