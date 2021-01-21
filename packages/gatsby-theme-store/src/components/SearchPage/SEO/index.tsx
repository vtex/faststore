import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import type { FC } from 'react'

import SiteMetadata from './SiteMetadata'
import StructuredData from './StructuredData'
import Canonical from './Canonical'
import type { SearchPageProps } from '../../../templates/search'

const SEO: FC<SearchPageProps> = (props) => {
  const {
    data: {
      vtex: { productSearch },
    },
    staticPath,
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

  const subProps = {
    ...props,
    siteMetadata,
  }

  return (
    <>
      <SiteMetadata {...subProps} />
      {staticPath === true && <StructuredData {...subProps} />}
      <Canonical {...subProps} />
    </>
  )
}

export default SEO
