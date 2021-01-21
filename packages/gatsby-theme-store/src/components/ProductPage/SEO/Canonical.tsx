import React from 'react'
import type { FC } from 'react'
import { useLocation } from '@reach/router'

import Helmet from '../../SEO/Helmet'
import type { ProductPageProps } from '../../../templates/product'

interface Props extends ProductPageProps {
  siteMetadata: {
    siteUrl: string
  }
}

const Canonical: FC<Props> = () => {
  const { pathname, host } = useLocation()

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
