import React from 'react'
import type { FC } from 'react'

import DefaultSiteMetadata from '../../SEO/SiteMetadata'
import type { SearchPageProps } from '../../../templates/search'

interface Props extends SearchPageProps {
  siteMetadata: {
    siteUrl: string
    description: string
    title: string
  }
}

const SiteMetadata: FC<Props> = (props) => {
  const {
    data: {
      vtex: { productSearch },
    },
    siteMetadata,
  } = props

  return (
    <DefaultSiteMetadata
      {...siteMetadata}
      title={productSearch!.titleTag ?? siteMetadata.title}
    />
  )
}

export default SiteMetadata
