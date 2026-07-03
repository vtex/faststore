import { forwardRef, useMemo } from 'react'
import type { Ref, AnchorHTMLAttributes } from 'react'
import NextLink from 'next/link'
import type { LinkProps as FrameworkLinkProps } from 'next/link'
import { Link as UILink } from '@faststore/ui'
import type { LinkProps as UILinkProps, LinkElementType } from '@faststore/ui'

import { useLink } from 'src/sdk/ui/useLink'

export type LinkProps<T extends LinkElementType = 'a'> = UILinkProps<T> &
  FrameworkLinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement>

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link<
  T extends LinkElementType = 'a',
>(
  {
    href,
    inverse,
    children,
    variant = 'default',
    prefetch,
    ...otherProps
  }: LinkProps<T>,
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
        // resolveLink already produces the fully localized href (custom path or
        // explicit locale prefix), so NextLink must not add its own locale
        // prefix on top of it. Otherwise SSR over-localizes (e.g.
        // /it-IT/europe/it/...) while the client keeps /europe/it/..., causing
        // a hydration mismatch.
        locale={false}
        legacyBehavior={false}
        prefetch={prefetch}
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
