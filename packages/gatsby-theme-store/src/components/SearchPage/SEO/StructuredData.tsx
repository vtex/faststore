/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react'
import { useLocation } from '@reach/router'
import type { FC } from 'react'
import type { BreadcrumbList, WithContext } from 'schema-dts'

import Helmet from '../../SEO/Helmet'
import type { SearchPageProps } from '../../../templates/search'

type Breadcrumb = NonNullable<
  SearchPageProps['data']['vtex']['facets']
>['breadcrumb']

const useStructuredBreadcrumb = (
  breadcrumb: Breadcrumb,
  siteUrl: string
): WithContext<BreadcrumbList> | null => {
  if (breadcrumb == null || breadcrumb.length === 0) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item!.name!,
      item: `${siteUrl}${item!.href}`,
    })),
  }
}

type Props = SearchPageProps

const StructuredData: FC<Props> = ({
  data: {
    vtex: { facets },
  },
  staticPath,
}) => {
  const { host } = useLocation()
  const breadcrumb = useStructuredBreadcrumb(
    facets!.breadcrumb,
    `https://${host}`
  )

  if (staticPath !== true || breadcrumb === null) {
    return null
  }

  return (
    <Helmet
      script={[
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(breadcrumb),
        },
      ]}
    />
  )
}

export default StructuredData
