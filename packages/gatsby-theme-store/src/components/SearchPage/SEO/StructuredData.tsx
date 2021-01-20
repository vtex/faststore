/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react'
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

interface Props extends SearchPageProps {
  siteMetadata: {
    siteUrl: string
  }
}

const StructuredData: FC<Props> = ({
  data: {
    vtex: { facets },
  },
  siteMetadata: { siteUrl },
}) => {
  const breadcrumb = useStructuredBreadcrumb(facets!.breadcrumb, siteUrl)

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
