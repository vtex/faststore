import { EmptyState as UIEmptyState } from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/src/components/overrides/EmptyState'
import type { SectionOverrideDefinition } from 'src/typings/overrides'

const { EmptyState } = getSectionOverrides(
  {
    EmptyState: UIEmptyState,
  },
  override as SectionOverrideDefinition<'EmptyState'>
)

export { EmptyState }
