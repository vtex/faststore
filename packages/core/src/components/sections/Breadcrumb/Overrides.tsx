import { Breadcrumb as UIBreadcrumb, Icon as UIIcon } from '@faststore/ui'

import type { BreadcrumbProps, IconProps } from '@faststore/ui'

import type {
  SectionOverrideDefinition,
  ComponentOverrideDefinition,
} from 'src/typings/overrides'
import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/Breadcrumb'

export type BreadcrumbOverrideDefinition = SectionOverrideDefinition<
  'Breadcrumb',
  {
    Breadcrumb: ComponentOverrideDefinition<BreadcrumbProps, BreadcrumbProps>
    Icon: ComponentOverrideDefinition<IconProps, IconProps>
  }
>

const { Breadcrumb, Icon } = getSectionOverrides(
  {
    Breadcrumb: UIBreadcrumb,
    Icon: UIIcon,
  },
  override as BreadcrumbOverrideDefinition
)

export { Breadcrumb, Icon }
