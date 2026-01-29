import { forwardRef, useMemo } from 'react'
import type { Ref, AnchorHTMLAttributes } from 'react'
import NextLink from 'next/link'
import type { LinkProps as FrameworkLinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { Link as UILink } from '@faststore/ui'
import type { LinkProps as UILinkProps, LinkElementType } from '@faststore/ui'

import { addCustomPathPrefix } from 'src/utils/customPaths'

export type LinkProps<T extends LinkElementType = 'a'> = UILinkProps<T> &
  FrameworkLinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement>

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link<
  T extends LinkElementType = 'a',
>(
  { href, inverse, children, variant = 'default', ...otherProps }: LinkProps<T>,
  ref: Ref<HTMLAnchorElement>
) {
  const router = useRouter()

  const isInternalLink = useMemo(
    () => href[0] === '/' && href[1] !== '/',
    [href]
  )

  const finalHref = useMemo(() => {
    if (isInternalLink) {
      return addCustomPathPrefix(href, router.asPath)
    }

    return href
  }, [href, isInternalLink, router.asPath])

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
