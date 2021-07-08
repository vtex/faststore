import { useMemo } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import type { BreadcrumbJsonLd } from 'gatsby-plugin-next-seo'

interface Breadcrumb {
  name: string
  href: string
}

export interface Options {
  breadcrumb: Breadcrumb[] | null | undefined
}

type BreadcrumbJSONLD = ComponentPropsWithoutRef<typeof BreadcrumbJsonLd>

export const useBreadcrumb = ({
  breadcrumb,
}: Options): BreadcrumbJSONLD | null =>
  useMemo(() => {
    if (breadcrumb == null || breadcrumb.length === 0) {
      return null
    }

    return {
      itemListElements: breadcrumb.map((item, index) => ({
        position: index + 1,
        name: item.name,
        item: item.href,
      })),
    }
  }, [breadcrumb])
