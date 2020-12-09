import React from 'react'
import type { FC } from 'react'

import SiteMetadataSEO from '../HomePage/SEO'
import type { SearchPageProps } from '../../templates/search'

const SEO: FC<SearchPageProps> = ({ data }) => (
  <SiteMetadataSEO title={data.vtex.productSearch!.titleTag!} />
)

export default SEO
