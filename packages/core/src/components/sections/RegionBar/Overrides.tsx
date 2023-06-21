import { RegionBar as UIRegionBar, Icon as UIIcon } from '@faststore/ui'
import type { IconProps, RegionBarProps } from '@faststore/ui'

import type {
  ComponentOverrideDefinition,
  SectionOverrideDefinition,
} from 'src/typings/overrides'
import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/RegionBar'

export type RegionBarOverrideDefinition = SectionOverrideDefinition<
  'RegionBar',
  {
    RegionBar: ComponentOverrideDefinition<
      RegionBarProps,
      Omit<RegionBarProps, 'onButtonClick' | 'postalCode'>
    >
    LocationIcon: ComponentOverrideDefinition<IconProps, IconProps>
    ButtonIcon: ComponentOverrideDefinition<IconProps, IconProps>
  }
>

const { RegionBar, LocationIcon, ButtonIcon } = getSectionOverrides(
  {
    RegionBar: UIRegionBar,
    LocationIcon: UIIcon,
    ButtonIcon: UIIcon,
  },
  override as RegionBarOverrideDefinition
)

export { RegionBar, LocationIcon, ButtonIcon }
