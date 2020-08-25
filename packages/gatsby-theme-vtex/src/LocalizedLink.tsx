
import React, { FC } from 'react'
import { GatsbyLinkProps, Link as GastbyLink } from 'gatsby'

//@ts-ignore
// import { useLocalizationContext, localizedPath } from '@vtex/gatsby-vtex-localization'

import { useLocalizationContext } from './components/Localization'

function isDefaultLang(locale: string, defaultLocale: string) {
  return locale === defaultLocale
}

function localizedPath(
  defaultLocale: string,
  locale: string,
  path: string
) {
  // The default language isn't prefixed
  if (isDefaultLang(locale, defaultLocale)) {
    return path
  }

  const [, base] = path.split(`/`)

  // If for whatever reason we receive an already localized path
  // (e.g. if the path was made with location.pathname)
  // just return it as-is.
  if (base === locale) {
    return path
  }

  // If it's another language, prefix with the locale
  return `/${locale}${path}`
}

interface Props extends GatsbyLinkProps<any> {}

const LocalizedLink: FC<Props> = (props) => {
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

export default LocalizedLink 
