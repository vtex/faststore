import { ProductShelf as UIProductShelf } from '@faststore/ui'
import ProductCard from '../../product/ProductCard'
import Carousel from '../../ui/Carousel'

export const CrossSellingShelfDefaultComponents = {
  ProductShelf: UIProductShelf,
  __experimentalCarousel: Carousel,
  __experimentalProductCard: ProductCard,
} as const
