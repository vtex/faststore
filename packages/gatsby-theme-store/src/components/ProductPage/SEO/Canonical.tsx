import React from 'react'
import type { FC } from 'react'
import { useLocation } from '@gatsbyjs/reach-router'

import Helmet from '../../SEO/Helmet'
import type { ProductPageProps } from '../../../templates/product'

interface Props extends ProductPageProps {
  siteMetadata: {
    siteUrl: string
  }
}

export const useCanonical = () => {
  const { pathname, host } = useLocation()

  return `https://${host}${pathname}`
}

const Canonical: FC<Props> = () => {
  const canonical = useCanonical()

  return (
    <Helmet
      link={[
        {
          rel: 'canonical',
          href: canonical,
        },
      ]}
    />
  )
}

export default Canonical
