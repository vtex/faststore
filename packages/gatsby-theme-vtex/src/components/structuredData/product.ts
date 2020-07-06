import {
  Product as VTEXProduct,
  Item as VTEXSku,
} from '@vtex/gatsby-source-vtex'
import {
  Product as StructuredProduct,
  Offer,
  ItemAvailability,
} from 'schema-dts'

import { writeJsonLD } from './jsonld'

type Product = StructuredProduct & { '@context': string }

const getSkuOffers = (sku: VTEXSku, currency: string): Offer[] =>
  sku.sellers.map(
    ({ commertialOffer: { Price, AvailableQuantity, PriceValidUntil } }) => ({
      '@type': 'Offer',
      price: Price,
      priceCurrency: currency,
      priceValidUntil: `${PriceValidUntil}`,
      availability:
        AvailableQuantity > 0
          ? ItemAvailability.InStock
          : ItemAvailability.OutOfStock,
    })
  )

const transform = (
  { productName, items, description, brand, brandImageUrl }: VTEXProduct,
  currency: string
): Product | null => {
  const [sku] = items
  const images = sku?.images.map((i) => i?.imageUrl)
  const offers = getSkuOffers(sku, currency)

  if (!sku || !images || offers.length === 0 || !brand) {
    return null
  }

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productName,
    image: images,
    offers,
    sku: sku.itemId,
    brand: {
      '@type': 'Brand',
      name: brand,
      logo: brandImageUrl,
    },
    description,
  }
}

export const inject = (product: VTEXProduct, currency: string) => {
  const structured = transform(product, currency)
  if (!structured) {
    return
  }
  writeJsonLD(structured)
}
