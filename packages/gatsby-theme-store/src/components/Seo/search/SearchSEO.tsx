import React from 'react'
import { BreadcrumbJsonLd, GatsbySeo } from 'gatsby-plugin-next-seo'
import type { FC } from 'react'

import { useMetadata } from '../../../sdk/seo/search/useMetadata'
import { useBreadcrumb } from '../../../sdk/seo/search/useBreadcrumbJsonLd'
import type { Options as MetadataOptions } from '../../../sdk/seo/search/useMetadata'
import type { Options as BreadcrumbOptions } from '../../../sdk/seo/search/useBreadcrumbJsonLd'

export type Props = MetadataOptions & BreadcrumbOptions

const SearchSEO: FC<Props> = (props) => {
  const metadata = useMetadata(props)
  const breadcrumb = useBreadcrumb(props)

  return (
    <>
      <GatsbySeo {...metadata} defer />
      {breadcrumb && <BreadcrumbJsonLd {...breadcrumb} defer />}
    </>
  )
}

export default SearchSEO
