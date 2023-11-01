import { Breadcrumb as UIBreadcrumb, Icon as UIIcon } from '@faststore/ui'

import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/Breadcrumb'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

const { Breadcrumb, Icon } = getSectionOverrides(
  {
    Breadcrumb: UIBreadcrumb,
    Icon: UIIcon,
  },
  override as SectionOverrideDefinition<'Breadcrumb'>
)

export { Breadcrumb, Icon }
