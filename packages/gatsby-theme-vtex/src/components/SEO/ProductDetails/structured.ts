import {
  Item as VTEXSku,
  Product as VTEXProduct,
} from '@vtex/gatsby-source-vtex'
import {
  ItemAvailability,
  Offer,
  Product as StructuredProduct,
} from 'schema-dts'

type TransformedProduct = StructuredProduct & { '@context': string }

interface TransformProduct {
  brandImageUrl: VTEXProduct['brandImageUrl']
  productName: VTEXProduct['productName']
  description: VTEXProduct['description']
  items: VTEXProduct['items']
  brand: VTEXProduct['brand']
}

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

export const transform = (
  { productName, items, description, brand, brandImageUrl }: TransformProduct,
  currency: string
): TransformedProduct | null => {
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
