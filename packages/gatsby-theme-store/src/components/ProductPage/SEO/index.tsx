import React, { useState } from 'react'
import { useLocation } from '@reach/router'
import type { FC } from 'react'

import { useIdleEffect } from '../../../sdk/useIdleEffect'
import { isBot, isDevelopment } from '../../../utils/env'
import SiteMetadata from '../../SEO/SiteMetadata'
import StructuredData from './StructuredData'
import type { ProductPageProps } from '../../../templates/product'
import Helmet from '../../SEO/Helmet'

const withSyncMetadata = isBot || isDevelopment

const SEO: FC<ProductPageProps> = (props) => {
  const [metadata, setMetadata] = useState(withSyncMetadata)
  const location = useLocation()

  useIdleEffect(() => setMetadata(true), [])

  if (!metadata) {
    return null
  }

  return (
    <>
      <SiteMetadata {...props} />
      <StructuredData {...props} />
      <Helmet
        link={[
          {
            rel: 'canonical',
            href: `https://${location.host}${location.pathname}`,
          },
        ]}
      />
    </>
  )
}

export default SEO
