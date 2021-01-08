import React from 'react'
import type { FC } from 'react'

import SiteMetadata from '../SEO/SiteMetadata'
import type { SearchPageProps } from '../../templates/search'

const SEO: FC<SearchPageProps> = ({ data }) => (
  <SiteMetadata title={data.vtex.productSearch!.titleTag!} />
)

export default SEO
