import React, { forwardRef } from 'react'
import type { ElementType, ReactElement } from 'react'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../typings'

type Variant = 'default' | 'display' | 'footer' | 'inline'

interface Props {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
 * Specifies the component variant.
 */
  variant?: Variant
  /**
  * Defines use of inverted color.
  */
  inverse?: boolean
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
  { as, children, variant, inverse,testId = 'store-link', ...otherProps }: LinkProps<C>,
  ref?: PolymorphicRef<C>
) {
  const Component = as ?? 'a'

  return (
    <Component 
      ref={ref} 
      data-fs-link 
      data-fs-link-variant={variant}
      data-fs-link-inverse={inverse}
      data-testid={testId} 
      {...otherProps}
    >
      {children}
    </Component>
  )
})

export default Link
