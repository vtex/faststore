import { RegionBar as UIRegionBar, Icon as UIIcon } from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/RegionBar'
import type { RegionBarOverrideDefinition } from 'src/typings/overrides'

const { RegionBar, LocationIcon, ButtonIcon } = getSectionOverrides(
  {
    RegionBar: UIRegionBar,
    LocationIcon: UIIcon,
    ButtonIcon: UIIcon,
  },
  override as RegionBarOverrideDefinition
)

export { RegionBar, LocationIcon, ButtonIcon }
