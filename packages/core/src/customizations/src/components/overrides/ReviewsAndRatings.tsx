// This is an example of how it can be used on the starter.

import type { SectionOverride } from 'src/typings/overrides'

const SECTION = 'ReviewsAndRatings' as const

const override: SectionOverride = {
  section: SECTION,
}

export { override }
