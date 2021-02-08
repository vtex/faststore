import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import type { FC } from 'react'

import Canonical from './Canonical'
import SiteMetadata from './SiteMetadata'
import StructuredData from './StructuredData'
import type { ProductPageProps } from '../../../templates/product'

const SEO: FC<ProductPageProps> = (props) => {
  const { site } = useStaticQuery(
    graphql`
      query ProductPageSEOQuery {
        site {
          siteMetadata {
            title
            titleTemplate
            siteUrl
            description
            author
          }
        }
      }
    `
  )

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
