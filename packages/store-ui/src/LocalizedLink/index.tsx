// import React, { FC } from 'react'
// import Link, { GatsbyLinkProps } from 'gatsby-link'
// import { useLocalizationContext, localizedPath } from '@vtex/gatsby-plugin-i18n'

// interface Props extends GatsbyLinkProps<any> { }

// const LocalizedLink: FC<Props> = (props) => {
//   const { children, ...rest } = props
//   console.log('teste useLocalizationContext ', useLocalizationContext)
//   console.log('teste localizedPath ', localizedPath)
//   // const { defaultLocale, locale } = useLocalizationContext()
//   const linkProps = rest as GatsbyLinkProps<any>
//   // const href = localizedPath(defaultLocale, locale, linkProps.to)
//   const href = 'a'
//   return (
//     //@ts-ignore
//     <Link {...linkProps} to={href}>
//       {children}
//     </Link>
//   )
// }

// export default LocalizedLink 
import React from 'react'
export const LocalizedLink: React.FC<any> = () => {
  return <div>oi</div>
}
// export default LocalizedLink 
