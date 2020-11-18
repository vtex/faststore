import React, { FC, useState } from 'react'

import { useIdleEffect } from '../../../sdk/useIdleEffect'
import { ProductPageProps } from '../../../templates/product'
import { isBot, isDevelopment, isServer } from '../../../utils/env'
import SiteMetadataSEO from '../../HomePage/SEO'
import StructuredData from './StructuredData'

const withSyncMetadata = isBot || isDevelopment

const SEO: FC<ProductPageProps> = (props) => {
  const [metadata, setMetadata] = useState(withSyncMetadata)

  useIdleEffect(() => setMetadata(true), [])

  // eslint-disable-next-line no-console
  console.log(!isServer && navigator.userAgent, isBot, isDevelopment)

  if (!metadata) {
    return null
  }

  return (
    <>
      <SiteMetadataSEO {...props} />
      <StructuredData {...props} />
    </>
  )
}

export default SEO
