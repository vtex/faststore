import { useMemo } from 'react'
import type { ComponentProps } from 'react'
import NextLink, { type LinkProps as NextJsLinkProps } from 'next/link'

import { Link as UILink } from '@faststore/ui'
import type { LinkProps as UILinkProps, LinkElementType } from '@faststore/ui'

export type LinkProps = Pick<
  UILinkProps<'a'>,
  'variant' | 'inverse' | 'size' | 'testId'
> &
  Omit<NextJsLinkProps, 'as'> &
  ComponentProps<'a'>

export default function Link({
  href,
  inverse,
  children,
  variant = 'default',
  ref,
  ...otherProps
}: LinkProps) {
  const isInternalLink = useMemo(
    () => href[0] === '/' && href[1] !== '/',
    [href]
  )

  if (isInternalLink) {
    return (
      <UILink
        as={NextLink}
        ref={ref}
        variant={variant}
        inverse={inverse}
        passHref
        href={href}
        {...otherProps}
      >
        {children}
      </UILink>
    )
  }

  return (
    <UILink
      ref={ref}
      href={href}
      variant={variant}
      inverse={inverse}
      {...otherProps}
    >
      {children}
    </UILink>
  )
}
