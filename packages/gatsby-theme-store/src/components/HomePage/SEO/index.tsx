import { useLocation } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbySeo, JsonLd } from 'gatsby-plugin-next-seo'
import React from 'react'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'

import type { HomePageSeoQueryQuery } from './__generated__/HomePageSEOQuery.graphql'

type Props = PageProps<unknown>

const SEO: FC<Props> = () => {
  const { host } = useLocation()
  const siteUrl = `https://${host}`
  const {
    site: {
      siteMetadata: { title, description, titleTemplate },
    },
  } = useStaticQuery<HomePageSeoQueryQuery>(
    graphql`
      query HomePageSEOQuery {
        site {
          siteMetadata {
            title
            titleTemplate
            description
            author
          }
        }
      }
    `
  )

  return (
    <>
      <GatsbySeo
        title={title}
        description={description}
        titleTemplate={titleTemplate}
        canonical={siteUrl}
        openGraph={{
          type: 'website',
          url: siteUrl,
          title,
          description,
        }}
        defer
      />
      <JsonLd
        json={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          url: siteUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/s/{search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
        defer
      />
    </>
  )
}

export default SEO
