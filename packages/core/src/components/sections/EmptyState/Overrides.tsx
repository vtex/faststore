import type { PropsWithChildren } from 'react'
import { EmptyState as UIEmptyState } from '@faststore/ui'
import type { EmptyStateProps } from '@faststore/ui'

import type {
  SectionOverrideDefinition,
  ComponentOverrideDefinition,
} from 'src/typings/overrides'
import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/EmptyState'

export type EmptyStateOverrideDefinition = SectionOverrideDefinition<
  'EmptyState',
  {
    EmptyState: ComponentOverrideDefinition<
      PropsWithChildren<EmptyStateProps>,
      EmptyStateProps
    >
  }
>

const { EmptyState } = getSectionOverrides(
  {
    EmptyState: UIEmptyState,
  },
  override as EmptyStateOverrideDefinition
)

export { EmptyState }
