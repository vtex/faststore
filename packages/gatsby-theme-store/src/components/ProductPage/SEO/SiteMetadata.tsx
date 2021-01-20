import React from 'react'
import type { FC } from 'react'

import DefaultSiteMetadata from '../../SEO/SiteMetadata'
import type { ProductPageProps } from '../../../templates/product'

interface Props extends ProductPageProps {
  siteMetadata: {
    siteUrl: string
    description: string
    title: string
  }
}

const SiteMetadata: FC<Props> = (props) => (
  <DefaultSiteMetadata {...props.siteMetadata} />
)

export default SiteMetadata
