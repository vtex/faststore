import React, { FC } from 'react'

import { ProductPageProps } from '../../../templates/product'
import SiteMetadataSEO from '../../HomePage/SEO'
import StructuredData from './StructuredData'

const SEO: FC<ProductPageProps> = (props) => (
  <>
    <SiteMetadataSEO {...props} />
    <StructuredData {...props} />
  </>
)

export default SEO
