import React from 'react'
import type { FC } from 'react'

import SiteMetadata from '../SEO/SiteMetadata'
import type { SearchPageProps } from '../../templates/search'
import Helmet from '../SEO/Helmet'

const SEO: FC<SearchPageProps> = ({
  data: {
    vtex: { productSearch },
  },
  pageContext: { staticPath },
}) => {
  return (
    <>
      {staticPath === false && (
        <Helmet
          meta={[
            {
              name: 'robots',
              content: 'noindex',
            },
          ]}
        />
      )}
      <SiteMetadata title={productSearch!.titleTag!} />
    </>
  )
}

export default SEO
