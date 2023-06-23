// This is an example of how it can be used on the starter.

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'Alert' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    Alert: { props: {} },
    Icon: { props: {} },
  },
}

export default overrides
