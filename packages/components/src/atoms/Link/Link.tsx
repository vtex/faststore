import type { ElementType } from 'react'
import type { PolymorphicComponentPropsWithRef } from '../../typings'

type LinkBaseProps = {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
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

export default function Link<C extends LinkElementType = 'a'>({
  as,
  children,
  variant = 'default',
  size = 'regular',
  inverse,
  testId = 'fs-link',
  ref,
  ...otherProps
}: LinkProps<C>) {
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
}
