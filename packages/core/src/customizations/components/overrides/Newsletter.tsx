import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'Newsletter' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {},
}

export default overrides
