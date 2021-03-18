import type { FC } from 'react'
import React from 'react'

import type { ProductPageProps } from '../../../templates/product'
import DefaultSiteMetadata from '../../SEO/SiteMetadata'

interface Props extends ProductPageProps {
  siteMetadata: {
    siteUrl: string
    description: string
    title: string
  }
}

const SiteMetadata: FC<Props> = ({
  data: {
    vtex: { product },
  },
  siteMetadata,
}) => (
  <DefaultSiteMetadata
    {...siteMetadata}
    title={product?.titleTag || siteMetadata.title}
    description={product?.metaTagDescription || siteMetadata.description}
  />
)

export default SiteMetadata
