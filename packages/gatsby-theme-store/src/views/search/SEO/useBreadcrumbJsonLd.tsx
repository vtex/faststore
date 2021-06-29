import { useLocation } from '@reach/router'
import { useMemo } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import type { BreadcrumbJsonLd } from 'gatsby-plugin-next-seo'

import type { SearchViewProps } from '..'

type Options = SearchViewProps

type BreadcrumbJSONLD = ComponentPropsWithoutRef<typeof BreadcrumbJsonLd>

export const useBreadcrumb = ({
  data: {
    vtex: { facets },
  },
}: Options): BreadcrumbJSONLD | null => {
  const { host } = useLocation()

  return useMemo(() => {
    const siteUrl = `https://${host}`
    const { breadcrumb } = facets!

    if (breadcrumb == null || breadcrumb.length === 0) {
      return null
    }

    return {
      itemListElements: breadcrumb.map((item: any, index: number) => ({
        position: index + 1,
        name: item!.name!,
        item: `${siteUrl}${item!.href}`,
      })),
    }
  }, [facets, host])
}
