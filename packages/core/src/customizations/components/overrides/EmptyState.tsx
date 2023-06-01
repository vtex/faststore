// This is an example of how it can be used on the starter.
import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'EmptyState' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    EmptyState: { props: {} },
  },
}

export default overrides
