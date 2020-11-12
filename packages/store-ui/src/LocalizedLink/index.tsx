import React, { FC } from 'react'
import Link, { GatsbyLinkProps } from 'gatsby-link'
import { useLocalizedPath } from '@vtex/gatsby-plugin-i18n'

type Props = GatsbyLinkProps<any>

const LocalizedLink: FC<Props> = (props) => {
  const { children, ...linkProps } = props
  const href = useLocalizedPath(props.to)

  return (
    // @ts-expect-error - Safe to ignore this type error
    <Link {...linkProps} to={href}>
      {children}
    </Link>
  )
}

export default LocalizedLink
