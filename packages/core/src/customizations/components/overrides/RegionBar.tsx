// This is an example of how it can be used on the starter.

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'RegionBar' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    RegionBar: { props: {} },
    LocationIcon: { props: {} },
    ButtonIcon: { props: {} },
  },
}

export default overrides
