import type { CurrencyCode, SelectItemEvent } from '@faststore/sdk'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import { useCallback } from 'react'
import { preload } from 'swr'
import type { AnalyticsItem, SearchSelectItemEvent } from '../analytics/types'
import { fetcherOffer } from '../offer'
import { useSession } from '../session'

export type ProductLinkOptions = {
  index: number
  product: ProductSummary_ProductFragment
  selectedOffer: number
}

export const useProductLink = ({
  index,
  product,
  selectedOffer,
}: ProductLinkOptions) => {
  const { slug } = product
  const {
    currency: { code },
  } = useSession()

  const onClick = useCallback(() => {
    import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
      sendAnalyticsEvent<SelectItemEvent<AnalyticsItem>>({
        name: 'select_item',
        params: {
          items: [
            {
              item_id: product.isVariantOf.productGroupID,
              item_name: product.isVariantOf.name,
              item_brand: product.brand.name,
              item_variant: product.sku,
              index,
              price: product.offers.offers[selectedOffer].price,
              discount:
                product.offers.offers[selectedOffer].listPrice -
                product.offers.offers[selectedOffer].price,
              currency: code as CurrencyCode,
              item_variant_name: product.name,
              product_reference_id: product.gtin,
            },
          ],
        },
      })

      sendAnalyticsEvent<SearchSelectItemEvent>({
        name: 'search_select_item',
        params: {
          url: window.location.href,
          items: [
            {
              item_id: product.isVariantOf.productGroupID,
              item_variant: product.sku,
              index,
            },
          ],
        },
      })
    })
  }, [code, product, index, selectedOffer])

  return {
    href: `/${slug}/p`,
    onClick,
    onMouseDown: () => {
      preload(product.sku, fetcherOffer)
    },
    onTouchStart: () => {
      preload(product.sku, fetcherOffer)
    },
    'data-testid': 'product-link',
  }
}
