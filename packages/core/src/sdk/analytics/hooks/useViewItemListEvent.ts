import { useCallback, useRef } from 'react'
import type { CurrencyCode, ViewItemListEvent } from '@vtex/faststore-sdk'

import { useSession } from '../../session'
import type { ProductSummary_ProductFragment } from '../../../../@generated/graphql'

import type { AnalyticsItem } from '../types'

type Props = {
  products?: Array<{ node: ProductSummary_ProductFragment }>
  title: string
  page: number
  pageSize: number
}

type ProductsFallbackProps = {
  products?: Array<{ node: ProductSummary_ProductFragment }>
}

export const useViewItemListEvent = ({
  products,
  title,
  page,
  pageSize,
}: Props) => {
  const {
    currency: { code },
  } = useSession()

  const sendViewItemListEvent = useCallback(
    (productsFallback?: ProductsFallbackProps) => {
      const items = products?.length ? products : productsFallback?.products

      if (!items || items.length === 0) {
        return
      }

      import('@vtex/faststore-sdk').then(({ sendAnalyticsEvent }) => {
        sendAnalyticsEvent<ViewItemListEvent<AnalyticsItem>>({
          name: 'view_item_list',
          params: {
            item_list_name: title,
            item_list_id: title,
            items: items.map(({ node: product }, index) => ({
              item_id: product.isVariantOf.productGroupID,
              item_name: product.isVariantOf.name,
              item_brand: product.brand.name,
              item_variant: product.sku,
              price: product.offers.offers[0].price,
              index: page * pageSize + index + 1,
              discount:
                product.offers.offers[0].listPrice -
                product.offers.offers[0].price,
              currency: code as CurrencyCode,
              item_variant_name: product.name,
              product_reference_id: product.gtin,
            })),
          },
        })
      })
    },
    [code, products, title, page, pageSize]
  )

  return { sendViewItemListEvent }
}
