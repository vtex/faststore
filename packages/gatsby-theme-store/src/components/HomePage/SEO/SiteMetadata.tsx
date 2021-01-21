import React from 'react'
import type { PageProps } from 'gatsby'
import type { FC } from 'react'

import DefaultSiteMetadata from '../../SEO/SiteMetadata'

interface Props extends PageProps<unknown> {
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
