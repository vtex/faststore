/**
 * One should use either noindex or canonical, never both

 * This deduplicates pages so our pages rank higher in Google
 */

import type { FC } from 'react'
import React from 'react'

import Helmet from '../../SEO/Helmet'

interface Props {
  pageContext: {
    canonicalPath?: string
  }
  siteMetadata: {
    siteUrl: string
  }
}

const Canonical: FC<Props> = ({
  pageContext: { canonicalPath },
  siteMetadata: { siteUrl },
}) => {
  if (typeof canonicalPath === 'string') {
    return (
      <Helmet
        link={[
          {
            rel: 'canonical',
            href: `${siteUrl}${canonicalPath}`,
          },
        ]}
      />
    )
  }

  return (
    <Helmet
      meta={[
        {
          name: 'robots',
          content: 'noindex',
        },
      ]}
    />
  )
}

export default Canonical
