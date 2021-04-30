import React from 'react'
import type { FC, AnchorHTMLAttributes, ComponentType } from 'react'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  Link?: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>> | string
  localizePath?: (x: string) => string
  state?: any
}

const LocalizedLink: FC<Props> = ({
  children,
  href,
  Link = 'a',
  localizePath = (x: string) => x,
  ...linkProps
}) => (
  <Link {...linkProps} href={localizePath(href!)}>
    {children}
  </Link>
)

export default LocalizedLink
