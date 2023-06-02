// This is an example of how it can be used on the starter.

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'Breadcrumb' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    Breadcrumb: { props: {} },
    Icon: { props: {} },
  },
}

export default overrides
