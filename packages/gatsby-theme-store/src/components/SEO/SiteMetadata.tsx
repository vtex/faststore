import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import type { FC } from 'react'

import Helmet from './Helmet'
import type { SiteMetadataQueryQuery } from './__generated__/SiteMetadataQuery.graphql'

export interface Props {
  description?: string
  lang?: string
  meta?: any[]
  title?: string
}

const SiteMetadata: FC<Props> = ({
  description,
  lang = 'en',
  meta = [],
  title,
}) => {
  const { site } = useStaticQuery<SiteMetadataQueryQuery>(
    graphql`
      query SiteMetadataQuery {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const { siteMetadata } = site as any
  const metaDescription = description ?? siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title ?? siteMetadata.title}
      titleTemplate={`%s | ${siteMetadata.title}`}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: siteMetadata.author,
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
      ].concat(meta)}
    />
  )
}

export default SiteMetadata
