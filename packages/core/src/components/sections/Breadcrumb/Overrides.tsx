import { Breadcrumb as UIBreadcrumb, Icon as UIIcon } from '@faststore/ui'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/Breadcrumb'
import type { BreadcrumbOverrideDefinition } from 'src/typings/overrides'

const { Breadcrumb, Icon } = getSectionOverrides(
  {
    Breadcrumb: UIBreadcrumb,
    Icon: UIIcon,
  },
  override as BreadcrumbOverrideDefinition
)

export { Breadcrumb, Icon }
