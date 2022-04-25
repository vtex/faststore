import NextLink from 'next/link'
import { forwardRef } from 'react'
import type { LinkProps } from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps

const Link = forwardRef<HTMLAnchorElement, Props>(
  ({ href, children, ...rest }, ref) => {
    return (
      <NextLink href={href}>
        <a {...rest} ref={ref}>
          {children}
        </a>
      </NextLink>
    )
  }
)

Link.displayName = 'Link'
export default Link
