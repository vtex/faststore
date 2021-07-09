import { useLocation } from '@reach/router'
import { useMemo } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import type { BreadcrumbJsonLd } from 'gatsby-plugin-next-seo'

import type { Product } from './types'

export type Options = {
  product?: Product
}

type BreadcrumbJSONLD = ComponentPropsWithoutRef<typeof BreadcrumbJsonLd>

export const useBreadcrumbJsonLd = (
  options: Options
): BreadcrumbJSONLD | null => {
  const { product } = options
  const { pathname } = useLocation()

  return useMemo(() => {
    if (
      product == null ||
      product.categoryTree == null ||
      product.categoryTree.length === 0
    ) {
      return null
    }

    const { categoryTree, productName } = product

    const itemListElements = categoryTree.map((item, index) => ({
      position: index + 1,
      name: item.name,
      item: item.href,
    }))

    const len: number = itemListElements.length

    itemListElements.push({
      position: len + 1,
      name: productName!,
      item: pathname,
    })

    return {
      itemListElements,
    }
  }, [pathname, product])
}
