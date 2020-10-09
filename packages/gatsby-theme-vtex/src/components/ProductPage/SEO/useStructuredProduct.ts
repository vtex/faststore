import { useMemo } from 'react'
import { ItemAvailability, Offer } from 'schema-dts'

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
    commercialOffer: {
      availableQuantity: number
      priceValidUntil: string
      price: number
    }
  }>
}

const getSkuOffers = (sku: SKU, currency: string): Offer[] =>
  sku.sellers.map((seller) => ({
    '@type': 'Offer',
    price: seller.commercialOffer.price,
    priceCurrency: currency,
    priceValidUntil: `${seller.commercialOffer.priceValidUntil}`,
    availability:
      seller.commercialOffer.availableQuantity > 0
        ? ItemAvailability.InStock
        : ItemAvailability.OutOfStock,
  }))

export const useStructuredProduct = (
  product: TransformProduct | null,
  currency: string
) =>
  useMemo(() => {
    if (product === null) {
      return ''
    }

    const { productName, items, description, brand } = product

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
      },
      description,
    }
  }, [product, currency])
