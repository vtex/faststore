import React, { FC } from 'react'
import { GatsbyLinkProps } from 'gatsby'
import { LocalizedLink } from "gatsby-theme-i18n"

interface Props extends GatsbyLinkProps<any> {}

const Link: FC<Props> = (props) => {
  const { children, ...rest } = props
  const linkProps = rest as GatsbyLinkProps<any>
  return (
    <LocalizedLink {...linkProps}>
      {children}
    </LocalizedLink>
  )
}

export default Link