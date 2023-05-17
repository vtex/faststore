// This is an example of how it can be used on the starter.

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'Hero' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    UIHero: { props: {} },
    UIHeroImage: { props: {} },
    UIHeroHeader: { props: {} },
  },
}

export default overrides
