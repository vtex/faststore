import React, { FC } from 'react'

import { ProductPageProps } from '../../../templates/product'
import { isBot } from '../../../utils/env'
import SiteMetadataSEO from '../../HomePage/SEO'
import StructuredData from './StructuredData'

const SEO: FC<ProductPageProps> = (props) => {
  console.log({ isBot, useAgent: navigator?.userAgent })

  return (
    <>
      <SiteMetadataSEO {...props} />
      {isBot && <StructuredData {...props} />}
    </>
  )
}

export default SEO
