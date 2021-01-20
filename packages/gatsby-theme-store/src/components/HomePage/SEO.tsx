import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'

import SiteMetadata from '../SEO/SiteMetadata'

type Props = PageProps<unknown>

const SEO: FC<Props> = () => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query HomePageSEOQuery {
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

  return <SiteMetadata {...siteMetadata} />
}

export default SEO
