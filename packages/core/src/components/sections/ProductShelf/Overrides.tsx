import { ProductShelf as UIProductShelf } from '@faststore/ui'

import ProductCard from 'src/components/product/ProductCard'
import Carousel from 'src/components/ui/Carousel'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/ProductShelf'
import type { ProductShelfOverrideDefinition } from 'src/typings/overrides'

const { ProductShelf, __experimentalCarousel, __experimentalProductCard } =
  getSectionOverrides(
    {
      ProductShelf: UIProductShelf,
      __experimentalCarousel: Carousel,
      __experimentalProductCard: ProductCard,
    },
    override as ProductShelfOverrideDefinition
  )

export { ProductShelf, __experimentalCarousel, __experimentalProductCard }
