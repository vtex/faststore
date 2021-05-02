import { GatsbySeo, BreadcrumbJsonLd } from 'gatsby-plugin-next-seo'
import React from 'react'
import type { FC } from 'react'

import { useCanonical } from './useCanonical'
import { useMetadata } from './useMetadata'
import { useBreadcrumb } from './useBreadcrumbJsonLd'
import type { SearchPageProps } from '../../../templates/search'

const SEO: FC<SearchPageProps> = (props) => {
  const metadata = useMetadata(props)
  const canonical = useCanonical(props as any)
  const breadcrumbProps = useBreadcrumb(props)

  return (
    <>
      <GatsbySeo {...metadata} {...canonical} defer />
      {breadcrumbProps !== null && (
        <BreadcrumbJsonLd {...breadcrumbProps} defer />
      )}
    </>
  )
}

export default SEO
