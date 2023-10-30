import { RegionBar as UIRegionBar, Icon as UIIcon } from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/src/components/overrides/RegionBar'
import type { SectionOverrideDefinition } from 'src/typings/overrides'

const { RegionBar, LocationIcon, ButtonIcon } = getSectionOverrides(
  {
    RegionBar: UIRegionBar,
    LocationIcon: UIIcon,
    ButtonIcon: UIIcon,
  },
  override as SectionOverrideDefinition<'RegionBar'>
)

export { RegionBar, LocationIcon, ButtonIcon }
