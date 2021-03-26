/**
 * One should use either noindex or canonical, never both
 *
 * This deduplicates pages so our pages rank higher in Google
 */

import React from 'react'
import type { FC } from 'react'
import { useLocation } from '@reach/router'

import type { SearchPageProps } from '../../../templates/search'
import Helmet from '../../SEO/Helmet'

interface Props extends SearchPageProps {
  siteMetadata: {
    siteUrl: string
  }
}

const Canonical: FC<Props> = (props) => {
  const { staticPath } = props

  const { pathname, host } = useLocation()

  if (staticPath === false) {
    return (
      <Helmet
        meta={[
          {
            name: 'robots',
            content: 'noindex',
          },
        ]}
      />
    )
  }

  return (
    <Helmet
      link={[
        {
          rel: 'canonical',
          href: `https://${host}${pathname}`,
        },
      ]}
    />
  )
}

export default Canonical
