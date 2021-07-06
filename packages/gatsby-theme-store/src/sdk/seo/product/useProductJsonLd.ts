import { useLocation } from '@reach/router'
import { useMemo } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import type { ProductJsonLd } from 'gatsby-plugin-next-seo'

import { useCurrency } from '../../localization/useCurrency'
import type { Product } from './types'

export type Options = {
  product?: Product
}

type ProductJSONLD = ComponentPropsWithoutRef<typeof ProductJsonLd>

export const useProductJsonLd = (options: Options): ProductJSONLD | null => {
  const { product } = options
  const { host, pathname } = useLocation()
  const [currency] = useCurrency()

  return useMemo(() => {
    if (product == null) {
      return null
    }

    const { productName: name, items, description, brand } = product

    const [sku] = items
    const images = sku.images.map((i) => i.imageUrl)
    const seller = sku.sellers?.[0]

    if (!seller || !brand) {
      return null
    }

    const offers = {
      price: `${seller.commercialOffer.spotPrice}`,
      priceCurrency: currency,
      url: `https://${host}${pathname}`,
      priceValidUntil: seller.commercialOffer.priceValidUntil?.slice(0, 10),
      availability:
        seller.commercialOffer.availableQuantity > 0
          ? ('InStock' as const)
          : ('OutOfStock' as const),
    }

    return {
      name,
      images,
      offers,
      sku: sku.itemId,
      brand,
      gtin13: sku.ean,
      description,
    }
  }, [currency, host, pathname, product])
}
