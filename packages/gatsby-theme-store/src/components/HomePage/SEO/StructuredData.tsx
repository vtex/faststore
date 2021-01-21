import React, { useMemo } from 'react'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'
import type { WebSite, WithContext } from 'schema-dts'

import Helmet from '../../SEO/Helmet'

interface Props extends PageProps<unknown> {
  siteMetadata: {
    siteUrl: string
  }
}

const removeTrailingSlashes = (x: string) =>
  x[x.length - 1] === '/' ? x.slice(0, x.length - 1) : x

const StructuredData: FC<Props> = ({ siteMetadata: { siteUrl } }) => {
  const siteLinks: WithContext<WebSite> = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${removeTrailingSlashes(siteUrl)}/{search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
    [siteUrl]
  )

  return (
    <Helmet
      script={[
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(siteLinks),
        },
      ]}
    />
  )
}

export default StructuredData
