import { ProductShelf as UIProductShelf } from '@faststore/ui'

import ProductCard from 'src/components/product/ProductCard'
import Carousel from 'src/components/ui/Carousel'

import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/ProductShelf'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

const { ProductShelf, __experimentalCarousel, __experimentalProductCard } =
  getSectionOverrides(
    {
      ProductShelf: UIProductShelf,
      __experimentalCarousel: Carousel,
      __experimentalProductCard: ProductCard,
    },
    override as SectionOverrideDefinition<'ProductShelf'>
  )

export { ProductShelf, __experimentalCarousel, __experimentalProductCard }
