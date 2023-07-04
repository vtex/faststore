import { Alert as UIAlert, Icon as UIIcon } from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/Alert'
import type { AlertOverrideDefinition } from 'src/typings/overrides'

const { Alert, Icon } = getSectionOverrides(
  {
    Alert: UIAlert,
    Icon: UIIcon,
  },
  override as AlertOverrideDefinition
)

export { Alert, Icon }
