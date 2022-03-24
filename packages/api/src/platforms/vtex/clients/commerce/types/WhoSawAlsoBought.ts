export interface WhoSawAlsoBought {
  name: string
  productID: string
  slug: string
  gtin: string
  sku: string
  id: string
  image: Image[]
  brand: { name: string }
  isVariantOf: {
    name: string
    productGroupID: string
    additionalProperty: Array<{
      name: string
      value: string
    }>
  }
  offers: {
    lowPrice: number
    offers: Array<{
      price: number
      listPrice: number
      seller: { identifier: string }
      quantity: number
    }>
  }
}

interface Image {
  url: string
  alternateName: string
}
