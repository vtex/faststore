import React, { FC } from 'react'

import SiteMetadataSEO from '../HomePage/SEO'
import { SearchPageProps } from '../../templates/search'

const SEO: FC<SearchPageProps> = ({ data }) => (
  <SiteMetadataSEO title={data.vtex.productSearch!.titleTag!} />
)

export default SEO
