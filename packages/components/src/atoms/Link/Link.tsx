import React, { forwardRef } from 'react'
import type { ElementType } from 'react'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../typings'

type LinkBaseProps = {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the component variant.
   */
  variant?: 'default' | 'display' | 'inline'
  /**
   * Specifies the size variant.
   */
  size?: 'small' | 'regular'
  /**
   * Defines the use of inverted colors.
   */
  inverse?: boolean
}

export type LinkElementType = ElementType

export type LinkProps<C extends LinkElementType = 'a'> =
  PolymorphicComponentPropsWithRef<C, LinkBaseProps>

const Link = forwardRef(function Link<C extends LinkElementType = 'a'>(
  {
    as,
    children,
    variant = 'default',
    size = 'regular',
    inverse,
    testId = 'fs-link',
    ...otherProps
  }: LinkProps<C>,
  ref?: PolymorphicRef<C>
) {
  const Component = as ?? 'a'

  return (
    <Component
      ref={ref}
      data-fs-link
      data-fs-link-variant={variant}
      data-fs-link-inverse={inverse}
      data-fs-link-size={size}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </Component>
  )
})

export default Link
