import React from 'react'
import type { FC } from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import SiteMetadata from '../../SEO/SiteMetadata'
import type { SearchPageProps } from '../../../templates/search'
import StructuredData from './StructuredData'
import Canonical from './Canonical'

const SEO: FC<SearchPageProps> = (props) => {
  const {
    data: {
      vtex: { productSearch },
    },
  } = props

  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query SearchPageSEOQuery {
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

  return (
    <>
      <SiteMetadata
        {...siteMetadata}
        title={productSearch!.titleTag ?? siteMetadata.title}
      />
      <StructuredData {...props} siteMetadata={siteMetadata} />
      <Canonical {...props} siteMetadata={siteMetadata} />
    </>
  )
}

export default SEO
