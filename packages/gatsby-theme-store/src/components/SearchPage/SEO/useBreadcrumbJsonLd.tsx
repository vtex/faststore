import { useLocation } from '@reach/router'
import { useMemo } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import type { BreadcrumbJsonLd } from 'gatsby-plugin-next-seo'

import type { SearchPageProps } from '../../../templates/search'

type Options = SearchPageProps

type Return = ComponentPropsWithoutRef<typeof BreadcrumbJsonLd> | null

export const useBreadcrumb = ({
  data: {
    vtex: { facets },
  },
  staticPath,
}: Options): Return => {
  const { host } = useLocation()

  return useMemo(() => {
    const siteUrl = `https://${host}`
    const { breadcrumb } = facets!

    if (staticPath !== true || breadcrumb == null || breadcrumb.length === 0) {
      return null
    }

    return {
      itemListElements: breadcrumb.map((item, index: number) => ({
        position: index + 1,
        name: item!.name!,
        item: `${siteUrl}${item!.href}`,
      })),
    }
  }, [facets, staticPath, host])
}
