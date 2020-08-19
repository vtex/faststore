import React, { FC } from 'react'
import { GatsbyLinkProps, Link as GastbyLink } from 'gatsby'
// import { LocalizedLink } from "gatsby-theme-i18n"

interface Props extends GatsbyLinkProps<any> {}

const Link: FC<Props> = (props) => {
  const { children, ...rest } = props
  const linkProps = rest as GatsbyLinkProps<any>
  return (
    //@ts-ignore
    <GastbyLink {...linkProps}>
      {children}
    </GastbyLink>
  )
}

export default Link