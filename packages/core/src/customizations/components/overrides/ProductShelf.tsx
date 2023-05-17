// This is an example of how it can be used on the starter.

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'ProductShelf' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    Carousel: { props: {} },
    ProductCard: { props: {} },
  },
}

export default overrides
