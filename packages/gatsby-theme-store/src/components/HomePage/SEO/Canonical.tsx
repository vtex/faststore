import React from 'react'
import { useLocation } from '@reach/router'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'

import Helmet from '../../SEO/Helmet'

interface Props extends PageProps<unknown> {
  siteMetadata: {
    siteUrl: string
  }
}

const Canonical: FC<Props> = () => {
  const { host } = useLocation()

  return (
    <Helmet
      link={[
        {
          rel: 'canonical',
          href: `https://${host}`,
        },
      ]}
    />
  )
}

export default Canonical
