import React, { FC, useEffect, useState } from 'react'

import { useIdleEffect } from '../../../sdk/useIdleEffect'
import { ProductPageProps } from '../../../templates/product'
import { isBot, isDevelopment } from '../../../utils/env'
import SiteMetadataSEO from '../../HomePage/SEO'
import StructuredData from './StructuredData'

const withSyncMetadata = isBot || isDevelopment

const SEO: FC<ProductPageProps> = (props) => {
  const [metadata, setMetadata] = useState(withSyncMetadata)

  useIdleEffect(() => setMetadata(true), [])

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log({ userAgent: navigator.userAgent, isBot, isDevelopment })
  })

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
