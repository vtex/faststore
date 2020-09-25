import React, { FC } from 'react'

import SiteMetadataSEO from '../HomePage/SEO'
import { Props } from '../../templates/search'

const SEO: FC<Props> = ({ data }) => (
  <SiteMetadataSEO title={data.vtex.productSearch!.titleTag!} />
)

export default SEO
