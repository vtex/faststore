// This is an example of how it can be used on the starter.

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'ProductGallery' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    Button: { props: {} },
    FilterIcon: { props: {} },
    PrevIcon: { props: {} },
    ResultsCountSkeleton: { props: {} },
    SortSkeleton: { props: {} },
    FilterButtonSkeleton: { props: {} },
    LinkButtonPrev: { props: {} },
    LinkButtonNext: { props: {} },
    __experimentalFilterDesktop: { props: {} },
    __experimentalFilterSlider: { props: {} },
    __experimentalProductCard: { props: {} },
  },
}

export default overrides
