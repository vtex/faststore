// This is an example of how it can be used on the starter.

import { SectionOverride } from 'app/typings/overrides'

const SECTION = 'Hero' as const

const override: SectionOverride = {
  section: SECTION,
}

export { override }
