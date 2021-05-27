import { BreadcrumbJsonLd, GatsbySeo } from 'gatsby-plugin-next-seo'
import React from 'react'
import type { FC } from 'react'

import { useBreadcrumb } from './useBreadcrumbJsonLd'
import { useMetadata } from './useMetadata'
import type { SearchViewProps } from '..'

const SEO: FC<SearchViewProps> = (props) => {
  const metadata = useMetadata(props)

  const breadcrumbProps = useBreadcrumb(props)

  return (
    <>
      <GatsbySeo {...metadata} defer />
      {breadcrumbProps !== null && (
        <BreadcrumbJsonLd {...breadcrumbProps} defer />
      )}
    </>
  )
}

export default SEO
