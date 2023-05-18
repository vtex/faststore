import { Breadcrumb as UIBreadcrumb } from '@faststore/ui'

import BreadcrumbCustomizations from 'src/customizations/components/overrides/Breadcrumb'

const Components = {
  UIBreadcrumb,
  ...BreadcrumbCustomizations.components,
}

export { Components }
