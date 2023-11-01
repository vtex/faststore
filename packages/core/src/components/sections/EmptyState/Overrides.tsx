import { EmptyState as UIEmptyState } from '@faststore/ui'

import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/EmptyState'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

const { EmptyState } = getSectionOverrides(
  {
    EmptyState: UIEmptyState,
  },
  override as SectionOverrideDefinition<'EmptyState'>
)

export { EmptyState }
