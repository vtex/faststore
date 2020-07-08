import { Image, Product, Item } from '@vtex/gatsby-source-vtex'

// Product data available in Product Details view AFTER hydration
export type AsyncProduct = Product

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
export type AsyncProductItem = AsyncProduct

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
  }>
}
