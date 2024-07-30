import { ProductShelf as UIProductShelf } from '@faststore/ui'
import ProductCard from 'app/components/product/ProductCard'
import Carousel from 'app/components/ui/Carousel'

export const ProductShelfDefaultComponents = {
  ProductShelf: UIProductShelf,
  __experimentalCarousel: Carousel,
  __experimentalProductCard: ProductCard,
} as const
