import {
  ItemAvailability,
  Offer,
  Product as StructuredProduct,
} from 'schema-dts'

type TransformedProduct = StructuredProduct & { '@context': string }

type TransformProduct = Partial<{
  brandImageUrl: string | null
  productName: string | null
  description: string | null
  brand: string | null
  items: Array<Sku | null | undefined> | null
}>

type Sku = Partial<{
  itemId: string | null
  images: Array<
    | Partial<{
        imageUrl: string | null
      }>
    | undefined
    | null
  > | null
  sellers: Array<
    | Partial<{
        commertialOffer: Partial<{
          AvailableQuantity: number | null
          PriceValidUntil: string | null
          Price: number | null
        }> | null
      }>
    | undefined
    | null
  > | null
}>

const getSkuOffers = (sku: Sku, currency: string): Offer[] =>
  sku.sellers!.map((seller) => ({
    '@type': 'Offer',
    price: seller!.commertialOffer!.Price!,
    priceCurrency: currency,
    priceValidUntil: `${seller!.commertialOffer!.PriceValidUntil}`,
    availability:
      seller!.commertialOffer!.AvailableQuantity! > 0
        ? ItemAvailability.InStock
        : ItemAvailability.OutOfStock,
  }))

export const transform = (
  { productName, items, description, brand, brandImageUrl }: TransformProduct,
  currency: string
): TransformedProduct | null => {
  const [sku] = items!
  const images = sku?.images?.map((i) => i?.imageUrl)
  const offers = getSkuOffers(sku!, currency)

  if (!sku || !images || offers.length === 0 || !brand) {
    return null
  }

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productName!,
    image: images as any,
    offers,
    sku: sku.itemId!,
    brand: {
      '@type': 'Brand',
      name: brand,
      logo: brandImageUrl!,
    },
    description: description!,
  }
}
