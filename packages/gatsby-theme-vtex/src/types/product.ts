import { Image, Product, Item } from '@vtex/gatsby-source-vtex'

// Product data available in Product Details synchronously
export type SyncProduct = {
  id: string
  slug: string
  productId: Product['productId']
  productName: Product['productName']
  description: Product['description']
  linkText: Product['linkText']
  items: Array<{
    itemId: Item['itemId']
    images: Array<{
      imageUrl: Image['imageUrl']
      imageText: Image['imageText']
    }>
  }>
}

// Product data available in Product Lists views AFTER hydration
export type AsyncProductItem = Product

// Product data available in Product Lists views synchronously
export type SyncProductItem = {
  id: string
  slug: string
  productId: Product['productId']
  productName: Product['productName']
  items: Array<{
    itemId: Item['itemId']
    images: Array<{
      imageUrl: Image['imageUrl']
      imageText: Image['imageText']
    }>
    sellers: Array<{
      sellerId: string
      commertialOffer: SyncProductCommertialOffer
    }>
  }>
}

export type SyncProductCommertialOffer = {
  AvailableQuantity: number
  Price: number
  ListPrice: number
}
