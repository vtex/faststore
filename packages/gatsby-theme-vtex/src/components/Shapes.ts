import { Image, Product } from '@vtex/gatsby-source-vtex'

export type DynamicProduct = Product

export interface StaticProduct {
  productName: Product['productName']
  description: Product['description']
  linkText: Product['linkText']
  items: Array<{
    images: Array<{
      imageUrl: Image['imageUrl']
      imageText: Image['imageText']
    }>
  }>
}
