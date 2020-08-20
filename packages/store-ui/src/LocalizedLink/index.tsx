import React, { FC } from 'react'
import { GatsbyLinkProps, Link as GastbyLink } from 'gatsby'

//@ts-ignore
import { useLocalizationContext, localizedPath } from '@vtex/gatsby-vtex-localization'

interface Props extends GatsbyLinkProps<any> {}

const Link: FC<Props> = (props) => {
  const { children, ...rest } = props
  const { defaultLocale, locale } = useLocalizationContext()
  const linkProps = rest as GatsbyLinkProps<any>
  const href = localizedPath(defaultLocale, locale, linkProps.to)
  return (
    //@ts-ignore
    <GastbyLink {...linkProps} to={href}>
      {children}
    </GastbyLink>
  )
}

export default Link