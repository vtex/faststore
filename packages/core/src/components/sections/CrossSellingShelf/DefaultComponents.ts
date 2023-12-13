import { ProductShelf as UIProductShelf } from '@faststore/ui'
import ProductCard from 'src/components/product/ProductCard'
import Carousel from 'src/components/ui/Carousel'

export const CrossSellingShelfDefaultComponents = {
  ProductShelf: UIProductShelf,
  __experimentalCarousel: Carousel,
  __experimentalProductCard: ProductCard,
} as const
