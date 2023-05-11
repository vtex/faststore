import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'ProductShelf' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    ProductCard: { props: {} },
    Carousel: { props: {} },
  },
}

export default overrides
