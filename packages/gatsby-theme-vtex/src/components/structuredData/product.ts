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

const getSkuOffers = (sku: VTEXSku): Offer[] =>
  sku.sellers.map(({ commertialOffer: { Price, AvailableQuantity } }) => ({
    '@type': 'Offer',
    price: Price,
    priceCurrency: 'TODO',
    availability:
      AvailableQuantity > 0
        ? ItemAvailability.InStock
        : ItemAvailability.OutOfStock,
  }))

const transform = ({ productName, items }: VTEXProduct): Product | null => {
  const [sku] = items
  const images = sku?.images.map((i) => i?.imageUrl)
  const offers = getSkuOffers(sku)

  if (!sku || !images || offers.length === 0) {
    return null
  }

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productName,
    image: images,
    offers,
  }
}

export const injectProductStructuredData = (product: VTEXProduct) => {
  const structured = transform(product)
  if (!structured) {
    return
  }

  console.log('injecting product structured data')

  writeJsonLD(structured)
}
