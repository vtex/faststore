import React, { FC } from 'react'

import { ProductPageProps } from '../../../templates/product'
import { isBot, isDevelopment } from '../../../utils/env'
import SiteMetadataSEO from '../../HomePage/SEO'
import StructuredData from './StructuredData'

const SEO: FC<ProductPageProps> = (props) => {
  const renderStructuredData = isBot || isDevelopment

  return (
    <>
      <SiteMetadataSEO {...props} />
      {renderStructuredData && <StructuredData {...props} />}
    </>
  )
}

export default SEO
