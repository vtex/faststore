// This is an example of how it can be used on the starter.
import type { SectionOverride } from '../../../../typings/overrides'

const SECTION = 'EmptyState' as const

const override: SectionOverride = {
  section: SECTION,
}

export { override }
