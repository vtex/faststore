import type { GatsbyLinkProps } from 'gatsby-link'
import Link from 'gatsby-link'
import type { FC } from 'react'
import React from 'react'

import { useLocalizedPath } from './useLocalizedPath'

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
