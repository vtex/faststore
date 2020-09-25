import {
  ItemAvailability,
  Offer,
  Product as StructuredProduct,
} from 'schema-dts'

type TransformedProduct = StructuredProduct & { '@context': string }

interface TransformProduct {
  brandImageUrl: string
  productName: string
  description: string
  brand: string
  items: SKU[]
}

interface SKU {
  itemId: string
  images: Array<{
    imageUrl: string
  }>
  sellers: Array<{
    commertialOffer: {
      AvailableQuantity: number
      PriceValidUntil: string
      Price: number
    }
  }>
}

const getSkuOffers = (sku: SKU, currency: string): Offer[] =>
  sku.sellers.map((seller) => ({
    '@type': 'Offer',
    price: seller.commertialOffer.Price,
    priceCurrency: currency,
    priceValidUntil: `${seller.commertialOffer.PriceValidUntil}`,
    availability:
      seller.commertialOffer.AvailableQuantity > 0
        ? ItemAvailability.InStock
        : ItemAvailability.OutOfStock,
  }))

export const transform = (
  { productName, items, description, brand, brandImageUrl }: TransformProduct,
  currency: string
): TransformedProduct | null => {
  const [sku] = items
  const images = sku.images.map((i) => i.imageUrl)
  const offers = getSkuOffers(sku, currency)

  if (!sku || !images || offers.length === 0 || !brand) {
    return null
  }

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productName,
    image: images as any,
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
