import { Alert as UIAlert, Icon as UIIcon } from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/src/components/overrides/Alert'
import type { SectionOverrideDefinition } from 'src/typings/overrides'

export const defaultComponents = {
  Alert: UIAlert,
  Icon: UIIcon,
} as const

const { Alert, Icon } = getSectionOverrides(
  defaultComponents,
  override as SectionOverrideDefinition<'Alert'>
)

export { Alert, Icon }
