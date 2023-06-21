import { Alert as UIAlert, Icon as UIIcon } from '@faststore/ui'
import type { AlertProps, IconProps } from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import type {
  SectionOverrideDefinition,
  ComponentOverrideDefinition,
} from 'src/typings/overrides'
import { override } from 'src/customizations/components/overrides/Alert'

export type AlertOverrideDefinition = SectionOverrideDefinition<
  'Alert',
  {
    Alert: ComponentOverrideDefinition<AlertProps, Omit<AlertProps, 'onClose'>>
    Icon: ComponentOverrideDefinition<IconProps, IconProps>
  }
>

const { Alert, Icon } = getSectionOverrides(
  {
    Alert: UIAlert,
    Icon: UIIcon,
  },
  override as AlertOverrideDefinition
)

export { Alert, Icon }
