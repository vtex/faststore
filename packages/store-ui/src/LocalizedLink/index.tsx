import React from 'react'
import { Link } from 'gatsby'
import { useLocalizedPath } from '@vtex/gatsby-plugin-i18n'
import type { FC } from 'react'
import type { GatsbyLinkProps } from 'gatsby'

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
