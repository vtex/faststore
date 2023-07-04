import { EmptyState as UIEmptyState } from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/EmptyState'
import type { EmptyStateOverrideDefinition } from 'src/typings/overrides'

const { EmptyState } = getSectionOverrides(
  {
    EmptyState: UIEmptyState,
  },
  override as EmptyStateOverrideDefinition
)

export { EmptyState }
