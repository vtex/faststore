import { forwardRef, useMemo } from 'react'
import type { Ref, AnchorHTMLAttributes } from 'react'
import NextLink from 'next/link'
import type { LinkProps as FrameworkLinkProps } from 'next/link'
import { Link as UILink } from '@faststore/ui'
import type { LinkProps as UILinkProps, LinkElementType } from '@faststore/ui'

import { useLink } from '../../../sdk/ui/useLink'

export type LinkProps<T extends LinkElementType = 'a'> = UILinkProps<T> &
  FrameworkLinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement>

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link<
  T extends LinkElementType = 'a',
>(
  { href, inverse, children, variant = 'default', ...otherProps }: LinkProps<T>,
  ref: Ref<HTMLAnchorElement>
) {
  const { resolveLink } = useLink()

  const isInternalLink = useMemo(
    () => href[0] === '/' && href[1] !== '/',
    [href]
  )

  const finalHref = useMemo(
    () => (isInternalLink ? (resolveLink(href) ?? href) : href),
    [href, isInternalLink, resolveLink]
  )

  if (isInternalLink) {
    return (
      <UILink
        as={NextLink}
        ref={ref}
        variant={variant}
        inverse={inverse}
        passHref
        href={finalHref}
        legacyBehavior={false}
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
})

export default Link
