import { graphql, useStaticQuery } from 'gatsby'
import React, { useState } from 'react'
import type { FC } from 'react'

import { useIdleEffect } from '../../../sdk/useIdleEffect'
import { isBot, isDevelopment } from '../../../utils/env'
import Canonical from './Canonical'
import StructuredData from './StructuredData'
import SiteMetadata from './SiteMetadata'
import type { ProductPageProps } from '../../../templates/product'

const withSyncMetadata = isBot || isDevelopment

const SEO: FC<ProductPageProps> = (props) => {
  const [metadata, setMetadata] = useState(withSyncMetadata)

  useIdleEffect(() => setMetadata(true), [])

  const { site } = useStaticQuery(
    graphql`
      query ProductPageSEOQuery {
        site {
          siteMetadata {
            title
            siteUrl
            description
            author
          }
        }
      }
    `
  )

  if (!metadata) {
    return null
  }

  const { siteMetadata } = site!

  const subProps = {
    ...props,
    siteMetadata,
  }

  return (
    <>
      <SiteMetadata {...subProps} />
      <Canonical {...subProps} />
      <StructuredData {...subProps} />
    </>
  )
}

export default SEO
