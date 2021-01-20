import { useLocation } from '@reach/router'
import React from 'react'
import type { FC } from 'react'

import Helmet from '../SEO/Helmet'
import SiteMetadata from '../SEO/SiteMetadata'
import type { SearchPageProps } from '../../templates/search'

const SEO: FC<SearchPageProps> = ({
  data: {
    vtex: { productSearch },
  },
  pageContext: { staticPath },
}) => {
  const location = useLocation()

  // One should use either noindex or canonical, never both
  // This deduplicates pages so our pages rank higher in Google
  const deduplicationTags =
    staticPath === false ? (
      <Helmet
        meta={[
          {
            name: 'robots',
            content: 'noindex',
          },
        ]}
      />
    ) : (
      <Helmet
        link={[
          {
            rel: 'canonical',
            href: `https://${location.host}${location.pathname}`,
          },
        ]}
      />
    )

  return (
    <>
      {deduplicationTags}
      <SiteMetadata title={productSearch!.titleTag!} />
    </>
  )
}

export default SEO
