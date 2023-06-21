import { ProductShelf as UIProductShelf } from '@faststore/ui'
import type { ProductShelfProps } from '@faststore/ui'

import ProductCard from 'src/components/product/ProductCard'
import Carousel from 'src/components/ui/Carousel'
import type {
  ComponentOverrideDefinition,
  SectionOverrideDefinition,
} from 'src/typings/overrides'
import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/ProductShelf'

export type ProductShelfOverrideDefinition = SectionOverrideDefinition<
  'ProductShelf',
  {
    ProductShelf: ComponentOverrideDefinition<
      ProductShelfProps,
      ProductShelfProps
    >
    __experimentalCarousel: ComponentOverrideDefinition<any, any>
    __experimentalProductCard: ComponentOverrideDefinition<
      any,
      Omit<any, 'key' | 'product' | 'index'>
    >
  }
>

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
