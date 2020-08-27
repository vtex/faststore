import React, { FC } from 'react'
import Link, { GatsbyLinkProps } from 'gatsby-link'
import { useLocalizationContext, localizedPath } from '@vtex/gatsby-plugin-i18n'

interface Props extends GatsbyLinkProps<any> { }

const LocalizedLink: FC<Props> = (props) => {
  const { children, ...rest } = props
  const { defaultLocale, locale } = useLocalizationContext()
  const linkProps = rest as GatsbyLinkProps<any>
  const href = localizedPath(defaultLocale, locale, linkProps.to)
  return (
    //@ts-ignore
    <Link {...linkProps} to={href}>
      {children}
    </Link>
  )
}

export default LocalizedLink 
