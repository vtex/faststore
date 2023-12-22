import { EmptyState as UIEmptyState } from '@faststore/ui'

import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/EmptyState'
import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'

const { EmptyState } = getSectionOverrides(
  {
    EmptyState: UIEmptyState,
  },
  override as SectionOverrideDefinitionV1<'EmptyState'>
)

export { EmptyState }
