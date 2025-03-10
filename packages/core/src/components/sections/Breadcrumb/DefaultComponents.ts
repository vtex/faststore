import { Icon as UIIcon } from '@faststore/ui'
import Breadcrumb from 'src/components/ui/Breadcrumb'

export const BreadcrumbDefaultComponents = {
  __experimentalBreadcrumb: Breadcrumb,
  Icon: UIIcon,
} as const
