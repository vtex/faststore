export interface Product {
  id: string
  titleTag?: string
  metaTagDescription?: string
  productName: string
  description: string
  brand: string
  linkText: string
  categoryTree?: Array<{
    name: string
    href: string
  }>
  items: Array<{
    itemId: string
    ean: string
    images: Array<{
      imageUrl: string
      imageText: string
    }>
    sellers?: Array<{
      commercialOffer: {
        spotPrice: string
        availableQuantity: number
        priceValidUntil: string
      }
    }>
  }>
}
