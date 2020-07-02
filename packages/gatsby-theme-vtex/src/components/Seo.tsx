import loadable from '@loadable/component'
import { Product } from '@vtex/gatsby-source-vtex'
import { graphql, useStaticQuery } from 'gatsby'
import React, { FC, useEffect } from 'react'
import { Helmet } from 'react-helmet'

import { SiteMetadata } from './openGraph/product'

// Code-splits structured data injection
// because it's not critical for rendering the page.
const structuredData = loadable.lib(() => import('./structuredData'))
const openGraph = loadable.lib(() => import('./openGraph'))

interface Props {
  description?: string
  lang?: string
  meta?: any[]
  title?: string
  product?: Product
}

const injectStructuredDataLazily = async (
  product: Product,
  siteMetadata: SiteMetadata
) => {
  const [structuredImport, openGraphImport] = await Promise.all([
    structuredData.load(),
    openGraph.load(),
  ])
  const {
    default: { injectProduct: injectStructuredProduct },
  } = structuredImport as any
  const {
    default: { injectProduct: injectProductOpenGraph },
  } = openGraphImport as any

  injectStructuredProduct(product)
  injectProductOpenGraph({ product, siteMetadata })
}

const SEO: FC<Props> = ({
  description,
  lang = 'en',
  meta = [],
  title,
  product,
}) => {
  const { site } = useStaticQuery(
    graphql`
      query {
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

  const metaDescription = description ?? site.siteMetadata.description

  // Inject StructuredData after rendering so we don't block the
  // rendering process and harm performance
  useEffect(() => {
    if (product) {
      injectStructuredDataLazily(product, site.siteMetadata)
    }
  }, [
    product,
    site.siteMetadata,
    site.siteMetadata.name,
    site.siteMetadata.title,
  ])

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title ?? site.siteMetadata.title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
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
          content: site.siteMetadata.author,
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

export default SEO
